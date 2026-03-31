import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../constants/user-role.constants';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtAuthInterface } from '../interfaces/jwt-auth.interface';
import { ERROR_MESSAGES } from '../constants/error-messages';
import { ERROR_CODES } from '../constants/error-codes';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: UserRole[] = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      return true;
    }

    const request: unknown = context.switchToHttp().getRequest<unknown>();
    const { user }: { user: JwtAuthInterface } = request as { user: JwtAuthInterface };

    const hasRequiredRole: boolean = requiredRoles.includes(user.role as UserRole);
    if (!hasRequiredRole) {
      throw new UnauthorizedException(ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS, ERROR_CODES.INSUFFICIENT_PERMISSIONS);
    }

    return true;
  }
}
