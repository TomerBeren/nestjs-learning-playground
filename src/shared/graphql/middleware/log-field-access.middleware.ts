import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const logFieldAccessMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const { info } = ctx;
  console.log(`[Field Access] ${info.parentType.name}.${info.fieldName}`);
  
  const value = await next();
  
  console.log(`[Field Value] ${info.parentType.name}.${info.fieldName} = ${JSON.stringify(value)}`);
  
  return value;
};
