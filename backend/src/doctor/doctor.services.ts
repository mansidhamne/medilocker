import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const createdDoctor = new this.doctorModel(createDoctorDto);
    return createdDoctor.save();
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorModel.find().exec();
  }

  async findOne(id: string): Promise<Doctor> {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    return doctor;
  }

  async findByEmail(email: string): Promise<Doctor> {
    return this.doctorModel.findOne({ email }).exec();
  }
}

//  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
//     const updatedDoctor = await this.doctorModel
//       .findByIdAndUpdate(id, updateDoctorDto, { new: true })
//       .exec();
//     if (!updatedDoctor) {
//       throw new NotFoundException('Doctor not found');
//     }
//     return updatedDoctor;
//   }

//   async remove(id: string): Promise<Doctor> {
//     const doctor = await this.doctorModel.findByIdAndRemove(id).exec();
//     if (!doctor) {
//       throw new NotFoundException('Doctor not found');
//     }
//     return doctor;
//   }
