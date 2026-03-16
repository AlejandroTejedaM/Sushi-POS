import { IsEmail, IsString } from 'class-validator';

export class LogInRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
