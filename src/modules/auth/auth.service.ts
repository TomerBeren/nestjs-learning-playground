import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  validateUser(username: string, password: string) {
    const user = this.usersService.findByUsername(username);
    if (user && user.password === password) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  login(username: string, password: string) {
    const user = this.validateUser(username, password);
    if (user) {
      return {
        access_token: 'fake-jwt-token',
        user,
      };
    }
    return null;
  }

  getUserByToken(token: string) {
    // Simple mock - in real app you'd decode JWT
    if (token === 'fake-jwt-token') {
      const user = this.usersService.findByUsername('admin');
      if (user) {
        const { password: _, ...result } = user;
        return result;
      }
    }
    return null;
  }
}