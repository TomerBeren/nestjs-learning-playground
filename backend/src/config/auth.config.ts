import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
  },
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
}));