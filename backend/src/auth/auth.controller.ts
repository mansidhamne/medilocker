// auth/auth.controller.ts
import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    UseGuards, 
    Req, 
    Res, 
    Query,
    UnauthorizedException 
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { AuthService } from './auth.service';
  import { Response } from 'express';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    // Doctor Google Auth
    @Get('doctor/google')
    @UseGuards(AuthGuard('google'))
    async doctorGoogleAuth(@Res() res: Response) {
      // This route will redirect to Google
    }
  
    @Get('doctor/google/callback')
    @UseGuards(AuthGuard('google'))
    async doctorGoogleAuthCallback(@Req() req: any, @Res() res: Response) {
      try {
        const data = await this.authService.googleLogin(req.user, 'doctor');
        console.log(req.user)
        // Handle successful authentication
        res.send(`
          <html>
            <body>
              <script>
                window.opener.postMessage(
                  {
                    type: 'GOOGLE_LOGIN_SUCCESS',
                    data: ${JSON.stringify(data)}
                  },
                  '${process.env.FRONTEND_URL}'
                );
                window.close();
              </script>
            </body>
          </html>
        `);
      } catch (error) {
        res.send(`
          <html>
            <body>
              <script>
                window.opener.postMessage(
                  {
                    type: 'GOOGLE_LOGIN_ERROR',
                    error: 'Authentication failed'
                  },
                  '${process.env.FRONTEND_URL}'
                );
                window.close();
              </script>
            </body>
          </html>
        `);
      }
    }
  
    // Patient Google Auth
    @Get('patient/google')
    @UseGuards(AuthGuard('google'))
    async patientGoogleAuth(@Res() res: Response) {
      // This route will redirect to Google
    }
  
    @Get('patient/google/callback')
    @UseGuards(AuthGuard('google'))
    async patientGoogleAuthCallback(@Req() req: any, @Res() res: Response) {
      try {
        const data = await this.authService.googleLogin(req.user, 'patient');
        
        res.send(`
          <html>
            <body>
              <script>
                window.opener.postMessage(
                  {
                    type: 'GOOGLE_LOGIN_SUCCESS',
                    data: ${JSON.stringify(data)}
                  },
                  '${process.env.FRONTEND_URL}'
                );
                window.close();
              </script>
            </body>
          </html>
        `);
      } catch (error) {
        res.send(`
          <html>
            <body>
              <script>
                window.opener.postMessage(
                  {
                    type: 'GOOGLE_LOGIN_ERROR',
                    error: 'Authentication failed'
                  },
                  '${process.env.FRONTEND_URL}'
                );
                window.close();
              </script>
            </body>
          </html>
        `);
      }
    }
  }