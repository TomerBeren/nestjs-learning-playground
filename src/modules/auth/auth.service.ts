import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { BcryptUtil } from "../../core/common/utils/bcrypt.util";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<{ id: number; username: string }> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await BcryptUtil.comparePassword(
      pass,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Return user data without password
    const { password, ...result } = user;
    return result;
  }

  async login(
    username: string,
    password: string
  ): Promise<{ access_token: string }> {
    // validateUser will throw UnauthorizedException if credentials are invalid
    const user = await this.validateUser(username, password);
    const payload = { sub: user.id, username: user.username };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getUserByToken(token: string): Promise<any> {
    try {
      // Decode and verify the JWT token
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.usersService.findOne(payload.sub);
      
      if (!user) {
        return null;
      }
      
      // Return user without password
      const { password, ...result } = user;
      return result;
    } catch (error) {
      return null;
    }
  }
}
