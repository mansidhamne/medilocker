// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const corsOptions: CorsOptions = {
//     origin: 'http://localhost:3001', // Replace with your frontend URL
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   };

//   app.enableCors(corsOptions);

//   await app.listen(3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { VercelRequest, VercelResponse } from '@vercel/node';

async function bootstrap(req: VercelRequest, res: VercelResponse) {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3001', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  // Enable CORS with the specified options
  app.enableCors(corsOptions);

  // Initialize the Nest application without listening on a port
  await app.init();

  // Call the NestJS request handler for the serverless function
  await app.getHttpAdapter().getInstance()(req, res);
}

// Export the bootstrap function as default
export default bootstrap;
