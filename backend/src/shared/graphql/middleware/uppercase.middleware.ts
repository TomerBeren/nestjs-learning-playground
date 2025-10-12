import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const uppercaseMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const value = await next();
  
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  
  return value;
};
