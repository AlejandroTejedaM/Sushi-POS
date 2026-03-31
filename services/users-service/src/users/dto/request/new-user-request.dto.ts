import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../../../common/constants/user-role.constants';

export class NewUserRequestDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(UserRole))
  roleCode: string;
}
