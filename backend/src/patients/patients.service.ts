// src/patient/patient.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Patient,
  PatientDocument,
  Appointment,
  Prescription,
} from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const newPatient = new this.patientModel(createPatientDto);
    return newPatient.save();
  }

  async findAll(): Promise<Patient[]> {
    return this.patientModel.find().exec();
  }

  async findById(id: string): Promise<Patient> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async findPatientIdByFirstName(firstName: string): Promise<string | null> {
    const patient = await this.patientModel
      .findOne({ firstName })
      .select('_id')
      .exec();
    return patient ? patient._id.toString() : null; // Return ID or null
  }

  async findPatientByFirstName(firstName: string): Promise<Patient> {
    const patient = await this.patientModel.findOne({ firstName }).exec();
    if (!patient) {
      throw new NotFoundException(
        `Patient with first name "${firstName}" not found`,
      );
    }
    return patient; // Return the entire patient document
  }

  async deleteById(id: string): Promise<void> {
    const result = await this.patientModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }

  async updateById(
    id: string,
    updatePatientDto: CreatePatientDto,
  ): Promise<Patient> {
    const existingPatient = await this.patientModel
      .findByIdAndUpdate(id, updatePatientDto, { new: true })
      .exec();
    if (!existingPatient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return existingPatient;
  }

  async addAppointmentToPatient(
    patientId: string,
    appointment: Appointment,
  ): Promise<Patient | null> {
    return this.patientModel
      .findByIdAndUpdate(
        patientId,
        { $push: { appointments: appointment } }, // Push new appointment to the appointments array
        { new: true }, // Return the updated patient document
      )
      .exec();
  }

  async getAppointmentsFromPatient(patientId: string): Promise<Appointment[]> {
    const patient = await this.findById(patientId);
    return patient.appointments;
  }

  async updateAppointmentInPatient(
    patientId: string,
    appointmentIndex: number,
    appointment: Partial<Appointment>,
  ): Promise<Patient | null> {
    return this.patientModel
      .findByIdAndUpdate(
        patientId,
        { $set: { [`appointments.${appointmentIndex}`]: appointment } }, // Update the specific appointment
        { new: true },
      )
      .exec();
  }

  async deleteAppointmentInPatient(
    patientId: string,
    appointmentIndex: number,
  ): Promise<Patient | null> {
    return this.patientModel
      .findByIdAndUpdate(
        patientId,
        { $pull: { appointments: { $slice: [appointmentIndex, 1] } } }, // Remove appointment at the specific index
        { new: true },
      )
      .exec();
  }

  async getAppointmentPrescriptions(
    patientId: string,
    appointmentIndex: number,
  ): Promise<Prescription[]> {
    const patient = await this.patientModel.findById(patientId).exec();
    if (patient && patient.appointments[appointmentIndex]) {
      return patient.appointments[appointmentIndex].prescription;
    }
    return null; // Return null if appointment or prescription is not found
  }
}
