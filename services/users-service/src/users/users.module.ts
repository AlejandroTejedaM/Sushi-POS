import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from './entities/user';
import { UserRole } from './entities/user-roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken, User, UserRole])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
