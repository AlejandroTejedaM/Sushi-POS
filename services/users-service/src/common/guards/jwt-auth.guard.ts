import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ERROR_MESSAGES } from '../constants/error-messages';
import { JwtAuthInterface } from '../interfaces/jwt-auth.interface';
import { ERROR_CODES } from '../constants/error-codes';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_NOT_FOUND, ERROR_CODES.TOKEN_NOT_FOUND);
    }

    try {
      request['user'] = this.jwtService.verify<JwtAuthInterface>(token);
    } catch {
      throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_INVALID, ERROR_CODES.TOKEN_INVALID);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers['authorization'] as string | undefined;
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
