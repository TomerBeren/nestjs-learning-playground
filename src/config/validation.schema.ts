import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // App config
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().port().default(3000),
  HOST: Joi.string().default('localhost'),
  API_PREFIX: Joi.string().default('api/v1'),
  
  // Database config
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_NAME: Joi.string().default('nestdocs'),
  DB_USER: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('password'),
  
  // JWT config
  JWT_SECRET: Joi.string().min(16).default('your-secret-key'),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  
  // Other config
  CORS_ENABLED: Joi.boolean().default(true),
});
