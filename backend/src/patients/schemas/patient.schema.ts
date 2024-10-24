import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface Prescription {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
}

// Define the Appointment interface
export interface Appointment {
  problem: string;
  doctorName: string;
  location: string;
  date: Date; // You may want to change this to Date type for better date handling
  time: string;
  mode: string;
  type: string;
  notes: string;
  prescription: Prescription[];
}

export type PatientDocument = Patient & Document;

@Schema()
export class Patient {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  dob: Date;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  contact: string;

  @Prop()
  address: string;

  @Prop()
  weight: number;

  @Prop()
  height: number;

  @Prop()
  pulseRate: number;

  @Prop()
  bloodPressure: number;

  @Prop()
  complaints: string;

  @Prop()
  surgeryHistory: string;

  @Prop()
  bloodGroup: string;

  @Prop({
    type: [
      {
        problem: { type: String, required: true },
        date: { type: String, required: true }, // Consider using Date type if you want better date management
        mode: { type: String, required: true },
        type: { type: String, required: true },
        notes: { type: String, required: false },
        time: { type: String, required: true },
        prescription: [
          {
            medicine: { type: String, required: true },
            dosage: { type: String, required: true },
            frequency: { type: String, required: true },
            duration: { type: String, required: true },
          },
        ],
      },
    ],
  })
  appointments: Appointment[]; // Embedded appointment schema
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
