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
  
  // GraphQL config
  GRAPHQL_PLAYGROUND: Joi.boolean().default(true),
  GRAPHQL_DEBUG: Joi.boolean().default(true),
  GRAPHQL_SCHEMA_FILE: Joi.string().default('src/schema.gql'),
  GRAPHQL_SORT_SCHEMA: Joi.boolean().default(true),
  GRAPHQL_INTROSPECTION: Joi.boolean().default(true),
  
  // Redis Microservice config
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_RETRY_ATTEMPTS: Joi.number().default(10),
  REDIS_RETRY_DELAY: Joi.number().default(3000),
  
  // Kafka Microservice config
  KAFKA_CLIENT_ID: Joi.string().default('nestdocs-app'),
  KAFKA_GROUP_ID: Joi.string().default('nestdocs-consumer'),
  KAFKA_BROKERS: Joi.string().default('localhost:9092'),
  
  // Other config
  CORS_ENABLED: Joi.boolean().default(true),
});
