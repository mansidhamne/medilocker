import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './doctor.schema';
import { Patient } from './patient.schema';
import * as bcrypt from 'bcrypt';

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
    const model: Model<Doctor | Patient> =
      role === 'doctor' ? this.doctorModel : this.patientModel;

    const user = await model.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any, role: 'doctor' | 'patient') {
    const payload = {
      email: user.email,
      sub: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      [role]: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async googleLogin(profile: any, role: 'doctor' | 'patient') {
    let user;
    const model: Model<Doctor | Patient> =
      role === 'doctor' ? this.doctorModel : this.patientModel;

    // Try to find the user in the appropriate model (Doctor/Patient)
    user = await model.findOne({ email: profile.email });

    // If user exists, login, otherwise create a new user
    if (user) {
      return this.login(user, role);
    }

    // Create a new user in the appropriate schema (Doctor/Patient)
    user = await model.create({
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      profilePicture: profile.picture,
      authProvider: 'google',
      googleId: profile.id,
    });

    // Login the newly created user
    return this.login(user, role);
  }
}
