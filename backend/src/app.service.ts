// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class AppService {
//   // googleLogin(req) {
//   //   if (!req.user) {
//   //     return 'No user from google';
//   //   }
//   //   return {
//   //     message: 'User information from google',
//   //     user: req.user,
//   //   };
//   // }
//   async getHello() {
//     return 'Hello World!';
//   }
// }

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
