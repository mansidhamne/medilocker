// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNotEmpty()
  name: string;
}
