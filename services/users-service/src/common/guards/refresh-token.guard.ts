import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { ERROR_CODES } from '../constants/error-codes';
import { ERROR_MESSAGES } from '../constants/error-messages';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['x-refresh-token'] as string | undefined;

    if (!token) {
      throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_NOT_FOUND, ERROR_CODES.TOKEN_NOT_FOUND);
    }

    const refreshToken = await this.usersService.getRefreshToken(token);

    if (!refreshToken) {
      throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_INVALID, ERROR_CODES.TOKEN_INVALID);
    }

    request['refreshToken'] = refreshToken;

    return true;
  }
}
