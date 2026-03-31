import { Expose } from 'class-transformer';

export class UserRoleResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;
}
