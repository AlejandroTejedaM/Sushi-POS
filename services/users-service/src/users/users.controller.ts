import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/constants/user-role.constants';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/response/user-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { SuccessMessages } from '../common/constants/success-messages';
import { NewUserRequestDto } from './dto/request/new-user-request.dto';
import { Req } from '@nestjs/common';
import type { AuthenticatedRequestInterface } from '../common/interfaces/authenticated-request.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  public async findAll(): Promise<UserResponseDto[]> {
    return await this.userService.getAllUsers();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ResponseMessage(SuccessMessages.USER_CREATED)
  public async newUser(@Body() newUserRequest: NewUserRequestDto): Promise<void> {
    return await this.userService.newUser(newUserRequest);
  }

  @Get('me/profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async getSelfProfile(@Req() req: AuthenticatedRequestInterface): Promise<UserResponseDto> {
    return await this.userService.getSelfProfile(req.user.sub);
  }
}
