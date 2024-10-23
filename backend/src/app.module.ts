import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientModule } from './patients/patients.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  ],
  controllers: [AppController],
  providers: [AppService],
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
