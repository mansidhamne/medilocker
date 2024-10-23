import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Patient } from '../patients/schemas/patient.schema';

@Schema()
export class Appointment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patient: Patient;

  @Prop({ required: true })
  problem: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  mode: string;

  @Prop({ required: false })
  type: string;

  @Prop({ required: false })
  prescription: {
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];

  @Prop({ required: false })
  notes: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
