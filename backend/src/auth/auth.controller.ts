import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string; name: string; role: 'doctor' | 'patient' }) {
    return this.authService.register(body.email, body.password, body.name, body.role);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  refresh(@Req() req: any) {
    return this.authService.refresh(req.user.sub);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  profile(@Req() req: any) {
    return this.authService.getProfile(req.user.sub);
  }
}