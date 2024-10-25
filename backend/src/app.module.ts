import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientModule } from './patients/patients.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DoctorModule } from './doctor/doctor.module';
import { ReportsModule } from './reports/reports.modules';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { ChatbotService } from './chatbot/chatbot.service';
import { ChatbotController } from './chatbot/chatbot.controller';
import { GoogleStrategy } from './google.strategy';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    PatientModule,
    AppointmentModule,
    AuthModule,
    DoctorModule,
    ReportsModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    UserModule,
  ],
  controllers: [AppController, ChatbotController],
  providers: [AppService, ChatbotService, GoogleStrategy],
})

// @Module({
//   imports: [
//     MongooseModule.forRoot(
//       'mongodb+srv://mansidhamne22:mansidhamne22@cluster0.hn3ew.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
//     ),
//     PatientModule,
//     AppointmentModule,
//     AuthModule
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
export class AppModule {}
