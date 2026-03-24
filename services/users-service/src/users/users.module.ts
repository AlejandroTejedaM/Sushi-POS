import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from './entities/user';
import { UserRole } from './entities/user-roles.entity';
import { UserRepository } from './repositories/user.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken, User, UserRole])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, RefreshTokenRepository],
  exports: [UsersService]
})
export class UsersModule {}
