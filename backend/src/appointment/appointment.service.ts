import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from './appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
  ) {}

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const newAppointment = new this.appointmentModel(createAppointmentDto);
    return newAppointment.save();
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return this.appointmentModel.find().exec();
  }

  async getOnlineAppointments(): Promise<Appointment[]> {
    return this.appointmentModel.find({ mode: 'online' }).exec();
  }

  async getTotalAppointments(): Promise<number> {
    return this.appointmentModel.countDocuments().exec();
  }

  async getTotalOnlineAppointments(): Promise<number> {
    return this.appointmentModel.countDocuments({ mode: 'Online' }).exec();
  }

  async addAppointmentNotes(id: string, notes: string) {
    const appointment = await this.appointmentModel.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // Add the notes if not already present
    appointment.notes = notes;
    return appointment.save();
  }

  async updateAppointmentNotes(
    id: string,
    notes: string,
  ): Promise<Appointment> {
    return this.appointmentModel
      .findByIdAndUpdate(id, { notes }, { new: true })
      .exec();
  }
}
