import { uppercaseMiddleware } from './uppercase.middleware';
import { logFieldAccessMiddleware } from './log-field-access.middleware';

describe('GraphQL Field Middleware', () => {
  describe('uppercaseMiddleware', () => {
    it('should convert string values to uppercase', async () => {
      const mockNext = jest.fn().mockResolvedValue('hello world');
      const mockContext = {} as any;

      const result = await uppercaseMiddleware(mockContext, mockNext);

      expect(result).toBe('HELLO WORLD');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return non-string values unchanged', async () => {
      const mockNext = jest.fn().mockResolvedValue(123);
      const mockContext = {} as any;

      const result = await uppercaseMiddleware(mockContext, mockNext);

      expect(result).toBe(123);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle null values', async () => {
      const mockNext = jest.fn().mockResolvedValue(null);
      const mockContext = {} as any;

      const result = await uppercaseMiddleware(mockContext, mockNext);

      expect(result).toBeNull();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle undefined values', async () => {
      const mockNext = jest.fn().mockResolvedValue(undefined);
      const mockContext = {} as any;

      const result = await uppercaseMiddleware(mockContext, mockNext);

      expect(result).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('logFieldAccessMiddleware', () => {
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
    });

    it('should log field access and value', async () => {
      const mockNext = jest.fn().mockResolvedValue('test value');
      const mockContext = {
        info: {
          parentType: { name: 'Author' },
          fieldName: 'firstName',
        },
      } as any;

      const result = await logFieldAccessMiddleware(mockContext, mockNext);

      expect(result).toBe('test value');
      expect(consoleLogSpy).toHaveBeenCalledWith('[Field Access] Author.firstName');
      expect(consoleLogSpy).toHaveBeenCalledWith('[Field Value] Author.firstName = "test value"');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should log field access for different types', async () => {
      const mockNext = jest.fn().mockResolvedValue({ id: 1, name: 'Test' });
      const mockContext = {
        info: {
          parentType: { name: 'Post' },
          fieldName: 'author',
        },
      } as any;

      const result = await logFieldAccessMiddleware(mockContext, mockNext);

      expect(result).toEqual({ id: 1, name: 'Test' });
      expect(consoleLogSpy).toHaveBeenCalledWith('[Field Access] Post.author');
      expect(consoleLogSpy).toHaveBeenCalledWith('[Field Value] Post.author = {"id":1,"name":"Test"}');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle null values', async () => {
      const mockNext = jest.fn().mockResolvedValue(null);
      const mockContext = {
        info: {
          parentType: { name: 'Comment' },
          fieldName: 'text',
        },
      } as any;

      const result = await logFieldAccessMiddleware(mockContext, mockNext);

      expect(result).toBeNull();
      expect(consoleLogSpy).toHaveBeenCalledWith('[Field Access] Comment.text');
      expect(consoleLogSpy).toHaveBeenCalledWith('[Field Value] Comment.text = null');
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
