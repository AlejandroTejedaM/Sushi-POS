import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user';
import { RefreshToken } from './entities/refresh-token.entity';
import { ConfigService } from '@nestjs/config';
import { ERROR_MESSAGES } from '../common/constants/error-messages';
import { randomUUID } from 'node:crypto';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { UserRepository } from './repositories/user.repository';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/response/user-response.dto';
import { NewUserRequestDto } from './dto/request/new-user-request.dto';
import { ERROR_CODES } from '../common/constants/error-codes';
import { UserRole } from './entities/user-roles.entity';
import { UserRoleRepository } from './repositories/user-role.repository';
import { genSalt, hash } from 'bcrypt';
import { DeleteResult } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRoleRepository: UserRoleRepository,
    private readonly configService: ConfigService
  ) {}

  public async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email }, relations: { userRole: true } });
  }

  public async createRefreshToken(userId: string): Promise<RefreshToken> {
    const refreshTokenExpirationDays: number | undefined = Number(this.configService.get<string>('JWT_REFRESH_EXPIRATION_DAYS'));
    if (!refreshTokenExpirationDays) {
      throw new Error(ERROR_MESSAGES.JWT_REFRESH_EXPIRATION_DAYS_NOT_FOUND);
    }

    const date = new Date();
    date.setDate(date.getDate() + refreshTokenExpirationDays);
    return await this.refreshTokenRepository.create({
      token: randomUUID(),
      user: { id: userId },
      expiresAt: date
    });
  }

  public async deleteRefreshTokenByUserId(userId: string): Promise<DeleteResult> {
    return await this.refreshTokenRepository.delete({ user: { id: userId } });
  }

  public getRefreshToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({ where: { token: token }, relations: { user: { userRole: true } } });
  }

  public async getAllUsers(): Promise<UserResponseDto[]> {
    const users: User[] = await this.userRepository.find({
      where: { active: true },
      relations: { userRole: true }
    });
    return plainToInstance(UserResponseDto, users, { excludeExtraneousValues: true });
  }

  public async newUser(newUserRequest: NewUserRequestDto): Promise<void> {
    const alreadyExists: User | null = await this.userRepository.findOne({ where: { email: newUserRequest.email } });
    if (alreadyExists) {
      throw new ConflictException(ERROR_MESSAGES.USER_ALREADY_EXISTS, ERROR_CODES.USER_ALREADY_EXISTS);
    }
    const role: UserRole | null = await this.userRoleRepository.findOne({ where: { code: newUserRequest.roleCode } });
    if (!role) {
      throw new UnauthorizedException(ERROR_MESSAGES.ROLE_NOT_FOUND, ERROR_CODES.ROLE_NOT_FOUND);
    }
    const generatedSalt: string = await genSalt();
    newUserRequest.password = await hash(newUserRequest.password, generatedSalt);
    await this.userRepository.create({
      fullName: newUserRequest.fullName,
      email: newUserRequest.email,
      passwordHash: newUserRequest.password,
      userRole: { id: role.id }
    });
  }

  public async getSelfProfile(userId: string): Promise<UserResponseDto> {
    const user: User | null = await this.userRepository.findOne({ where: { id: userId }, relations: { userRole: true } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND, ERROR_CODES.USER_NOT_FOUND);
    }
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }
}
