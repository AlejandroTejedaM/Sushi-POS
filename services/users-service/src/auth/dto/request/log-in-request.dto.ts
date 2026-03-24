import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LogInRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
