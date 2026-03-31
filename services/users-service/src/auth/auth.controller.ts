import { Body, Controller, Post, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInRequestDto } from './dto/request/log-in-request.dto';
import { AuthResponseDto } from './dto/response/auth-response.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { SuccessMessages } from '../common/constants/success-messages';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import type { RefreshTokenRequest } from '../common/interfaces/refresh-token-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async logIn(@Body() logInRequestDto: LogInRequestDto): Promise<AuthResponseDto> {
    return await this.authService.logIn(logInRequestDto.email, logInRequestDto.password);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ResponseMessage(SuccessMessages.LOGOUT)
  public async logOut(@Req() req: RefreshTokenRequest): Promise<void> {
    return await this.authService.logOut(req.refreshToken.token);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RefreshTokenGuard)
  @ResponseMessage(SuccessMessages.REFRESH)
  public async refresh(@Req() req: RefreshTokenRequest): Promise<AuthResponseDto> {
    return await this.authService.refresh(req.refreshToken.token);
  }
}
