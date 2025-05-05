import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('nonce')
  generateNonce() {
    const nonce = this.authService.generateNonce();
    const message = `Sign this message to authenticate with our platform: ${nonce}`;
    return { nonce, message };
  }
}