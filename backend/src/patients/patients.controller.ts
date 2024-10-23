// src/patient/patient.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Put,
  Param,
} from '@nestjs/common';
import { PatientService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Appointment, Patient, Prescription } from './schemas/patient.schema';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}
  @Post()
  async create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  findAll(): Promise<Patient[]> {
    return this.patientService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Patient> {
    return this.patientService.findById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.patientService.deleteById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePatientDto: CreatePatientDto,
  ): Promise<Patient> {
    return this.patientService.updateById(id, updatePatientDto);
  }

  @Post(':id/appointments')
  async addAppointment(
    @Param('id') patientId: string,
    @Body() appointment: Appointment,
  ): Promise<Patient | null> {
    return this.patientService.addAppointmentToPatient(patientId, appointment);
  }

  @Get(':id/appointments')
  async getAppointments(
    @Param('id') patientId: string,
  ): Promise<Appointment[]> {
    return this.patientService.getAppointmentsFromPatient(patientId);
  }

  @Put(':id/appointments/:appointmentIndex')
  async updateAppointment(
    @Param('id') patientId: string,
    @Param('appointmentIndex') appointmentIndex: number,
    @Body() appointment: Partial<Appointment>,
  ): Promise<Patient | null> {
    return this.patientService.updateAppointmentInPatient(
      patientId,
      appointmentIndex,
      appointment,
    );
  }

  @Delete(':id/appointments/:appointmentIndex')
  async deleteAppointment(
    @Param('id') patientId: string,
    @Param('appointmentIndex') appointmentIndex: number,
  ): Promise<Patient | null> {
    return this.patientService.deleteAppointmentInPatient(
      patientId,
      appointmentIndex,
    );
  }

  @Get(':id/appointments/:appointmentIndex/prescriptions')
  async getAppointmentPrescriptions(
    @Param('id') patientId: string,
    @Param('appointmentIndex') appointmentIndex: number,
  ): Promise<Prescription[]> {
    return this.patientService.getAppointmentPrescriptions(
      patientId,
      appointmentIndex,
    );
  }
}
