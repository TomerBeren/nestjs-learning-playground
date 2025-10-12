import * as bcrypt from 'bcrypt';

/**
 * Utility class for bcrypt password hashing operations
 */
export class BcryptUtil {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hash a plain text password
   * @param password - The plain text password to hash
   * @returns The hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare a plain text password with a hashed password
   * @param plainPassword - The plain text password
   * @param hashedPassword - The hashed password to compare against
   * @returns True if passwords match, false otherwise
   */
  static async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Generate a salt for manual hashing
   * @param rounds - Number of rounds for salt generation (default: 10)
   * @returns The generated salt
   */
  static async generateSalt(rounds: number = this.SALT_ROUNDS): Promise<string> {
    return bcrypt.genSalt(rounds);
  }
}
