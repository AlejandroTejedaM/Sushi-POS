import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { ConfigService } from '@nestjs/config';
import { ERROR_MESSAGES } from '../common/constants/error-messages';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService
  ) {}

  public async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  public async createRefreshToken(userId: string): Promise<RefreshToken> {
    const date = new Date();
    const refreshTokenExpirationDays: number | undefined = Number(this.configService.get<string>('JWT_REFRESH_EXPIRATION_DAYS'));
    if (!refreshTokenExpirationDays) {
      throw new Error(ERROR_MESSAGES.JWT_REFRESH_EXPIRATION_DAYS_NOT_FOUND);
    }
    date.setDate(date.getDate() + refreshTokenExpirationDays);
    const refreshToken: RefreshToken = this.refreshTokenRepository.create({
      token: randomUUID(),
      user: { id: userId },
      expiresAt: date
    });

    return await this.refreshTokenRepository.save(refreshToken);
  }

  public async deleteRefreshTokenByUserId(userId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ user: { id: userId } });
  }
}
