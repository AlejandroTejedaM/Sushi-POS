import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInRequestDto } from './dto/request/log-in-request.dto';
import { AuthResponseDto } from './dto/response/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async logIn(@Body() logInRequestDto: LogInRequestDto): Promise<AuthResponseDto> {
    return await this.authService.logIn(logInRequestDto.email, logInRequestDto.password);
  }
}
