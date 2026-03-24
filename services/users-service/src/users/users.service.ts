import { Injectable } from '@nestjs/common';
import { User } from './entities/user';
import { RefreshToken } from './entities/refresh-token.entity';
import { ConfigService } from '@nestjs/config';
import { ERROR_MESSAGES } from '../common/constants/error-messages';
import { randomUUID } from 'node:crypto';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly configService: ConfigService
  ) {}

  public async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
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

  public async deleteRefreshTokenByUserId(userId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ user: { id: userId } });
  }

  public getRefreshToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({ where: { token: token }, relations: { user: true } });
  }
}
