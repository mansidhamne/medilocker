import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Doctor } from './doctor.schema';
import { Patient } from './patient.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
    role: 'doctor' | 'patient',
  ) {
    const model = role === 'doctor' ? this.doctorModel : this.patientModel;
    const user = await this.doctorModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any, role: 'doctor' | 'patient') {
    const payload = {
      email: user.email,
      sub: user._id,
      role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      [role]: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        ...(role === 'doctor' && {
          specialization: user.specialization,
          isVerified: user.isVerified,
        }),
        ...(role === 'patient' && {
          dateOfBirth: user.dateOfBirth,
        }),
      },
    };
  }

  async googleLogin(profile: any, role: 'doctor' | 'patient') {
    const model = role === 'doctor' ? this.doctorModel : this.patientModel;
    let user = await this.doctorModel.findOne({ email: profile.email });

    if (!user) {
      user = await this.doctorModel.create({
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        profilePicture: profile.picture,
        authProvider: 'google',
        googleId: profile.id,
      });
    }

    return this.login(user, role);
  }
}
