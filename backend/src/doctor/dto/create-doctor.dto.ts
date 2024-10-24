import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Patient } from 'src/patients/schemas/patient.schema';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  specialization?: string;

  @IsString()
  @IsOptional()
  hospital?: string;

  @IsArray()
  @IsOptional()
  patients?: Patient[];
}
