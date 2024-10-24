import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  specialization: string;

  @Prop({ required: false })
  hospital: string;

  @Prop({ default: [] })
  patients: string[]; // Array of patient IDs linked to this doctor
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
