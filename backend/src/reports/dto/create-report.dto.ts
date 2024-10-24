import { IsString, IsEnum, IsOptional, IsDate } from 'class-validator';

export class CreateReportDto {
  @IsString()
  name: string;

  @IsEnum(['personal', 'medical'])
  type: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsString()
  fileUrl: string;

  @IsString()
  patientId: string;
}
