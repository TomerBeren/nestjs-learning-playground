import { BcryptUtil } from './bcrypt.util';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');

describe('BcryptUtil', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash a password with default salt rounds', async () => {
      const plainPassword = 'mySecurePassword123';
      const hashedPassword = '$2b$10$hashedPasswordExample';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await BcryptUtil.hashPassword(plainPassword);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
    });

    it('should handle different passwords', async () => {
      const password1 = 'password1';
      const password2 = 'password2';
      const hash1 = '$2b$10$hash1';
      const hash2 = '$2b$10$hash2';

      (bcrypt.hash as jest.Mock)
        .mockResolvedValueOnce(hash1)
        .mockResolvedValueOnce(hash2);

      const result1 = await BcryptUtil.hashPassword(password1);
      const result2 = await BcryptUtil.hashPassword(password2);

      expect(result1).toBe(hash1);
      expect(result2).toBe(hash2);
      expect(bcrypt.hash).toHaveBeenCalledTimes(2);
    });
  });

  describe('comparePassword', () => {
    it('should return true when passwords match', async () => {
      const plainPassword = 'myPassword';
      const hashedPassword = '$2b$10$hashedPassword';

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await BcryptUtil.comparePassword(plainPassword, hashedPassword);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    });

    it('should return false when passwords do not match', async () => {
      const plainPassword = 'wrongPassword';
      const hashedPassword = '$2b$10$hashedPassword';

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await BcryptUtil.comparePassword(plainPassword, hashedPassword);

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    });

    it('should handle multiple comparisons', async () => {
      (bcrypt.compare as jest.Mock)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      const result1 = await BcryptUtil.comparePassword('correct', 'hash1');
      const result2 = await BcryptUtil.comparePassword('wrong', 'hash2');
      const result3 = await BcryptUtil.comparePassword('correct2', 'hash3');

      expect(result1).toBe(true);
      expect(result2).toBe(false);
      expect(result3).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledTimes(3);
    });
  });

  describe('generateSalt', () => {
    it('should generate a salt with default rounds', async () => {
      const mockSalt = '$2b$10$mockSalt';

      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);

      const result = await BcryptUtil.generateSalt();

      expect(result).toBe(mockSalt);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    });

    it('should generate a salt with custom rounds', async () => {
      const mockSalt = '$2b$12$mockSalt';

      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);

      const result = await BcryptUtil.generateSalt(12);

      expect(result).toBe(mockSalt);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(12);
    });
  });
});
