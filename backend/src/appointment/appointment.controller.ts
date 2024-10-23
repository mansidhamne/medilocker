import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    return await this.appointmentService.createAppointment(
      createAppointmentDto,
    );
  }

  @Get()
  async getAllAppointments() {
    return await this.appointmentService.getAllAppointments();
  }

  @Get('online')
  async getOnlineAppointments() {
    return await this.appointmentService.getOnlineAppointments();
  }

  @Get('total')
  async getTotalAppointments() {
    const totalAppointments =
      await this.appointmentService.getTotalAppointments();
    return { total: totalAppointments };
  }

  @Get('total-online')
  async getTotalOnlineAppointments() {
    const totalOnlineAppointments =
      await this.appointmentService.getTotalOnlineAppointments();
    return { total: totalOnlineAppointments };
  }

  @Post(':id/notes')
  async addAppointmentNotes(
    @Param('id') id: string,
    @Body('notes') notes: string,
  ) {
    if (!id || !notes) {
      throw new BadRequestException('Appointment ID and notes are required');
    }

    const updatedAppointment =
      await this.appointmentService.addAppointmentNotes(id, notes);
    return updatedAppointment;
  }

  @Put(':id/notes')
  async updateAppointmentNotes(
    @Param('id') id: string,
    @Body('notes') notes: string,
  ) {
    const updatedAppointment =
      await this.appointmentService.updateAppointmentNotes(id, notes);
    return updatedAppointment;
  }
}
