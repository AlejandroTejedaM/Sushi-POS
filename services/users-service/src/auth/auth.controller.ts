import { Body, Controller, Post, Headers, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInRequestDto } from './dto/request/log-in-request.dto';
import { AuthResponseDto } from './dto/response/auth-response.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessMessages } from '../common/constants/success-messages';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async logIn(@Body() logInRequestDto: LogInRequestDto): Promise<AuthResponseDto> {
    return await this.authService.logIn(logInRequestDto.email, logInRequestDto.password);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(SuccessMessages.LOGOUT)
  public async logOut(@Headers('x-refresh-token') token: string): Promise<void> {
    return await this.authService.logOut(token);
  }
}
