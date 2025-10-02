import { logger } from './logger.middleware';
import { Request, Response, NextFunction } from 'express';

describe('LoggerMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      method: 'GET',
      originalUrl: '/cats'
    };
    res = {};
    next = jest.fn();
    
    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
    expect(typeof logger).toBe('function');
  });

  it('should log request info', () => {
    logger(req as Request, res as Response, next);

    expect(console.log).toHaveBeenCalledWith('[GET] /cats');
    expect(next).toHaveBeenCalled();
  });

  it('should call next function', () => {
    logger(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
