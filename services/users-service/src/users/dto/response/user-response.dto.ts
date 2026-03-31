import { Expose, Type } from 'class-transformer';
import { UserRoleResponseDto } from './user-role-response.dto';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  email: string;

  @Expose()
  active: boolean;

  @Expose()
  @Type(() => UserRoleResponseDto)
  userRole: UserRoleResponseDto;
}
