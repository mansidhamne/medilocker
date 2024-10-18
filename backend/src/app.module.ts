import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientModule } from './patients/patients.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://mansidhamne22:mansidhamne22@cluster0.hn3ew.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    PatientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
