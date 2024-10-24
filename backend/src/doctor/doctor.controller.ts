import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DoctorService } from './doctor.services';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Doctor } from './schemas/doctor.schema';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorService.create(createDoctorDto);
  }

  @Get()
  async findAll(): Promise<Doctor[]> {
    return this.doctorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Doctor> {
    return this.doctorService.findOne(id);
  }
}

// @Put(':id')
//   async update(
//     @Param('id') id: string,
//     @Body() updateDoctorDto: UpdateDoctorDto,
//   ): Promise<Doctor> {
//     return this.doctorService.update(id, updateDoctorDto);
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: string): Promise<Doctor> {
//     return this.doctorService.remove(id);
//   }
