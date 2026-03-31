import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../constants/user-role.constants';

export const ROLES_KEY = 'roles';
export function Roles(...roles: UserRole[]): MethodDecorator {
  return SetMetadata(ROLES_KEY, roles);
}
