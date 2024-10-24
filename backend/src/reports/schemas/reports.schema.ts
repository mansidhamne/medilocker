import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Report extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['personal', 'medical'] })
  type: string;

  @Prop()
  date: Date;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ required: true })
  patientId: string; // Assuming you have a way to identify the patient
}

export const ReportSchema = SchemaFactory.createForClass(Report);
