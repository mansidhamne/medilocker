import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from './schemas/reports.schema';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Report.name) private reportModel: Model<Report>) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const createdReport = new this.reportModel(createReportDto);
    return createdReport.save();
  }

  async findAll(): Promise<Report[]> {
    return this.reportModel.find().exec();
  }

  async findOne(id: string): Promise<Report> {
    return this.reportModel.findById(id).exec();
  }

  async findByPatientId(patientId: string): Promise<Report[]> {
    return this.reportModel.find({ patientId }).exec();
  }

  async remove(id: string): Promise<Report> {
    return this.reportModel.findByIdAndDelete(id);
  }
}
