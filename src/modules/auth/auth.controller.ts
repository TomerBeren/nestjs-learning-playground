import { Controller, Post, Body, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto.username, loginDto.password);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return result;
  }

  @Post('validate')
  async validateUser(@Body() loginDto: LoginDto) {
    const user = this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { user };
  }

  @Get('profile')
  async getProfile(@Headers('authorization') auth: string) {
    if (!auth) {
      throw new UnauthorizedException('No token provided');
    }
    
    const token = auth.replace('Bearer ', '');
    const user = this.authService.getUserByToken(token);
    
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    
    return { user };
  }
}