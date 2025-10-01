import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { User, PublicUser } from './interfaces';

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, name: 'John', email: 'john@test.com', username: 'admin', password: 'admin123', roles: ['admin'] },
    { id: 2, name: 'Jane', email: 'jane@test.com', username: 'user', password: 'user123', roles: ['user'] },
  ];

  findAll(): PublicUser[] {
    return this.users.map(({ password, ...user }) => user);
  }

  findOne(id: number): PublicUser | undefined {
    const user = this.users.find(user => user.id === id);
    if (user) {
      const { password, ...publicUser } = user;
      return publicUser;
    }
    return undefined;
  }

  findByUsername(username: string): User | undefined {
    return this.users.find(user => user.username === username);
  }

  create(createUserDto: CreateUserDto): PublicUser {
    const newUser: User = {
      id: this.users.length + 1,
      username: createUserDto.username || `user${this.users.length + 1}`,
      password: createUserDto.password || 'defaultpass',
      roles: createUserDto.roles || ['user'],
      ...createUserDto,
    };
    this.users.push(newUser);
    const { password, ...publicUser } = newUser;
    return publicUser;
  }
}