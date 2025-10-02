import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(username: string, password: string): Promise<{ access_token: string; user: any } | null> {
    const user = await this.validateUser(username, password);
    if (user) {
      return {
        access_token: 'fake-jwt-token',
        user,
      };
    }
    return null;
  }

  async getUserByToken(token: string): Promise<any> {
    // Simple mock - in real app you'd decode JWT
    if (token === 'fake-jwt-token') {
      const user = await this.usersService.findByUsername('admin');
      if (user) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }
}