import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsNumber,
} from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsDate()
  @IsNotEmpty()
  dob: Date;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  weight: number;

  @IsNumber()
  @IsOptional()
  height: number;

  @IsNumber()
  @IsOptional()
  pulseRate?: number;

  @IsNumber()
  @IsOptional()
  bloodPressure?: number;

  @IsString()
  @IsOptional()
  bloodGroup?: string;

  @IsString()
  @IsNotEmpty()
  complaints: string;

  @IsString()
  @IsOptional()
  surgeryHistory: string;
}
