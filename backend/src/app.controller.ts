// import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';
// //import { AuthGuard } from '@nestjs/passport';

// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}

//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
//   // @UseGuards(AuthGuard('google'))
//   // async googleAuth(@Req() req) {}

//   // @Get('auth/google/callback')
//   // @UseGuards(AuthGuard('google'))
//   // async googleAuthRedirect(@Req() req) {
//   //   return this.appService.googleLogin(req);
//   // }
// }
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
