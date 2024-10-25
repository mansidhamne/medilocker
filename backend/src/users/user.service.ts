// src/auth/user.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto'; // Make sure this DTO exists
import * as bcrypt from 'bcrypt'; // For password hashing
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create a new user
    const user = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });

    try {
      return await user.save(); // Save the user to the database
    } catch (error) {
      // Handle duplicate email conflict
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error; // Rethrow other errors
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: User }> {
    const user = await this.userModel.findOne({ email: loginDto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { email: user.email, id: user._id }; // You can include more fields in the payload if necessary
    const access_token = this.jwtService.sign(payload);

    return { access_token, user }; // Return access token and user data
  }
}
