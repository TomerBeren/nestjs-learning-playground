# NestJS Configuration Architecture

## Why Use ConfigService?

Using `ConfigService` instead of direct `process.env` access provides several benefits:

1. **Type Safety** - ConfigService is typed and integrated with TypeScript
2. **Centralized Configuration** - All config in one place
3. **Validation** - Joi schema validates env vars at startup
4. **Testability** - Easy to mock in tests
5. **Defaults** - Fallback values defined in one place
6. **Namespacing** - Organized config (e.g., `redis.host`, `kafka.brokers`)
7. **Reusability** - Access config from anywhere in the app
8. **Hot Reload** - Config changes reflected without restart (in dev mode)

## Configuration Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Environment Variables                     │
│  (.env files, Docker environment, system environment)        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Validation Schema (Joi)                     │
│  src/config/validation.schema.ts                             │
│  - Validates all env vars                                    │
│  - Provides defaults                                         │
│  - Ensures type correctness                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 Config Factories (registerAs)                │
│  src/config/*.config.ts                                      │
│  - appConfig: HTTP server settings                           │
│  - databaseConfig: TypeORM settings                          │
│  - authConfig: JWT settings                                  │
│  - redisConfig: Redis microservice settings                  │
│  - kafkaConfig: Kafka microservice settings                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                ConfigModule (Global)                         │
│  src/app.module.ts                                           │
│  ConfigModule.forRoot({                                      │
│    isGlobal: true,                                           │
│    load: [appConfig, redisConfig, kafkaConfig, ...]          │
│  })                                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    ConfigService                             │
│  Available everywhere via dependency injection               │
│  configService.get('redis.host')                             │
│  configService.get('kafka.brokers')                          │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/
├── config/
│   ├── app.config.ts           # HTTP server config
│   ├── database.config.ts      # Database config
│   ├── auth.config.ts          # JWT auth config
│   ├── features.config.ts      # Feature flags
│   ├── graphql.config.ts       # GraphQL config
│   ├── redis.config.ts         # Redis microservice config ✨
│   ├── kafka.config.ts         # Kafka microservice config ✨
│   ├── validation.schema.ts    # Joi validation schema
│   └── index.ts                # Central exports
├── main.ts                     # Bootstrap with ConfigService
└── app.module.ts               # Global ConfigModule setup
```

## Configuration Pattern

### 1. Define Schema (`validation.schema.ts`)
```typescript
export const validationSchema = Joi.object({
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),
  // ...
});
```

### 2. Create Config Factory (`redis.config.ts`)
```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT ?? 6379),
}));
```

### 3. Create Helper Function (`redis.config.ts`)
```typescript
export const getRedisConfig = (configService: ConfigService): RedisOptions => ({
  transport: Transport.REDIS,
  options: {
    host: configService.get('redis.host') as string,
    port: configService.get('redis.port') as number,
  },
});
```

### 4. Register in AppModule (`app.module.ts`)
```typescript
ConfigModule.forRoot({
  isGlobal: true,
  load: [appConfig, redisConfig, kafkaConfig],
  validationSchema,
});
```

### 5. Use in Bootstrap (`main.ts`)
```typescript
const configService = app.get(ConfigService);
app.connectMicroservice(getRedisConfig(configService));
```

### 6. Use Anywhere in App
```typescript
@Injectable()
export class SomeService {
  constructor(private configService: ConfigService) {}
  
  getRedisHost() {
    return this.configService.get('redis.host');
  }
}
```

## Benefits of This Architecture

### ✅ Type Safety
```typescript
// ❌ Bad: No type safety
const host = process.env.REDIS_HOST;

// ✅ Good: Type safe with ConfigService
const host = configService.get('redis.host') as string;
```

### ✅ Validation at Startup
```typescript
// App fails to start if invalid config
REDIS_PORT=invalid  // ❌ Joi will catch this
```

### ✅ Centralized Defaults
```typescript
// No need to repeat defaults everywhere
const port = process.env.REDIS_PORT ?? 6379;  // ❌ Repeated
const port = configService.get('redis.port'); // ✅ Default in config
```

### ✅ Easy Testing
```typescript
const mockConfigService = {
  get: jest.fn().mockReturnValue('test-value'),
};
```

### ✅ Namespaced Configuration
```typescript
configService.get('redis.host');      // Clear namespace
configService.get('kafka.brokers');   // Clear namespace
configService.get('app.port');        // Clear namespace
```

## Environment Variables

### Redis Microservice
- `REDIS_HOST` - Redis server hostname (default: localhost)
- `REDIS_PORT` - Redis server port (default: 6379)
- `REDIS_RETRY_ATTEMPTS` - Connection retry attempts (default: 10)
- `REDIS_RETRY_DELAY` - Delay between retries in ms (default: 3000)

### Kafka Microservice
- `KAFKA_CLIENT_ID` - Kafka client identifier (default: nestdocs-app)
- `KAFKA_GROUP_ID` - Kafka consumer group (default: nestdocs-consumer)
- `KAFKA_BROKERS` - Comma-separated broker list (default: localhost:9092)

## Best Practices

1. ✅ **Always use ConfigService** instead of `process.env`
2. ✅ **Use `registerAs`** for namespaced configs
3. ✅ **Validate with Joi** in `validation.schema.ts`
4. ✅ **Provide defaults** in config factories
5. ✅ **Use `??` (nullish coalescing)** instead of `||`
6. ✅ **Type your config getters** with `as Type`
7. ✅ **Make ConfigModule global** with `isGlobal: true`
8. ✅ **Keep config files separate** (one per concern)

## Migration Guide

### Before (Direct process.env)
```typescript
// main.ts
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: redisHost, port: redisPort },
});
```

### After (ConfigService)
```typescript
// config/redis.config.ts
export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT ?? 6379),
}));

export const getRedisConfig = (configService: ConfigService): RedisOptions => ({
  transport: Transport.REDIS,
  options: {
    host: configService.get('redis.host') as string,
    port: configService.get('redis.port') as number,
  },
});

// main.ts
const configService = app.get(ConfigService);
app.connectMicroservice(getRedisConfig(configService));
```

## Summary

Using `ConfigService` provides:
- ✅ Type safety
- ✅ Validation
- ✅ Testability
- ✅ Centralization
- ✅ Namespace organization
- ✅ Better DX (Developer Experience)

This is the **NestJS recommended approach** and aligns with enterprise-grade application architecture.
