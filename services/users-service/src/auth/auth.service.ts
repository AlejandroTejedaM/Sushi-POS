import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../users/entities/refresh-token.entity';
import { ERROR_MESSAGES } from '../common/constants/error-messages';
import { ERROR_CODES } from '../common/constants/error-codes';
import { AuthResponseDto } from './dto/response/auth-response.dto';
import { JwtAuthInterface } from '../common/interfaces/jwt-auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  public async logIn(email: string, password: string): Promise<AuthResponseDto> {
    const user: User | null = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_OR_PASSWORD_INCORRECT, ERROR_CODES.USER_OR_PASSWORD_INCORRECT);
    }
    const passwordMatch: boolean = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_OR_PASSWORD_INCORRECT, ERROR_CODES.USER_OR_PASSWORD_INCORRECT);
    }
    const accessToken: string = this.generateJwtAccessToken(user);
    await this.userService.deleteRefreshTokenByUserId(user.id);
    const refreshToken: RefreshToken = await this.userService.createRefreshToken(user.id);
    return {
      refresh_token: refreshToken.token,
      access_token: accessToken
    };
  }

  public async logOut(token: string): Promise<void> {
    const refreshToken: RefreshToken | null = await this.userService.getRefreshToken(token);
    if (!refreshToken) {
      throw new NotFoundException(ERROR_MESSAGES.TOKEN_NOT_FOUND, ERROR_CODES.TOKEN_NOT_FOUND);
    }

    await this.userService.deleteRefreshTokenByUserId(refreshToken.user.id);
  }

  public async refresh(token: string): Promise<AuthResponseDto> {
    const refreshToken: RefreshToken | null = await this.userService.getRefreshToken(token);
    if (!refreshToken) {
      throw new NotFoundException(ERROR_MESSAGES.TOKEN_NOT_FOUND, ERROR_CODES.TOKEN_NOT_FOUND);
    }
    const user: User = refreshToken.user;
    await this.userService.deleteRefreshTokenByUserId(user.id);
    const accessToken: string = this.generateJwtAccessToken(user);
    const newRefreshToken: RefreshToken = await this.userService.createRefreshToken(user.id);
    return {
      refresh_token: newRefreshToken.token,
      access_token: accessToken
    };
  }

  private generateJwtAccessToken(user: User): string {
    const payload: JwtAuthInterface = { sub: user.id, role: user.userRole.code };
    return this.jwtService.sign(payload);
  }
}
