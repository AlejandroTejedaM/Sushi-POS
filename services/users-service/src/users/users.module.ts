import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from './entities/user';
import { UserRole } from './entities/user-roles.entity';
import { UserRepository } from './repositories/user.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { UserRoleRepository } from './repositories/user-role.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken, User, UserRole])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, RefreshTokenRepository, UserRoleRepository],
  exports: [UsersService]
})
export class UsersModule {}
