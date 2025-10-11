# Configuration Modules Pattern

## Why Use Dedicated Config Modules?

Instead of loading all configurations globally in `AppModule`, NestJS best practice is to use **feature-specific config modules** that are imported only where needed.

## ❌ Anti-Pattern: Global Config Loading

```typescript
// app.module.ts - BAD: Loads everything globally
ConfigModule.forRoot({
  isGlobal: true,
  load: [appConfig, redisConfig, kafkaConfig, stripeConfig, awsConfig, ...],
});
```

**Problems:**
- ❌ Loads configs even if features aren't used
- ❌ Tight coupling - all configs loaded at startup
- ❌ Hard to test individual features
- ❌ Violates Single Responsibility Principle
- ❌ Can't lazy-load modules with their configs

## ✅ Best Practice: Feature Config Modules

```typescript
// core/config-modules/redis-config.module.ts
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  exports: [ConfigModule],
})
export class RedisConfigModule {}

// modules/events/events.module.ts
@Module({
  imports: [
    RedisConfigModule,  // Only import where needed!
    KafkaConfigModule,
  ],
  controllers: [EventsController],
})
export class EventsModule {}
```

**Benefits:**
- ✅ Lazy loading - config loaded only when module is imported
- ✅ Explicit dependencies - clear which modules need which config
- ✅ Better testability - mock only the config you need
- ✅ Modular - each config is self-contained
- ✅ Tree-shakeable - unused configs won't be bundled

## Architecture Comparison

### Before (Global Loading)
```
┌─────────────────────────────────────────┐
│            AppModule                    │
│  ConfigModule.forRoot({                 │
│    load: [                              │
│      appConfig,    ← Always loaded      │
│      redisConfig,  ← Always loaded      │
│      kafkaConfig,  ← Always loaded      │
│      stripeConfig, ← Always loaded      │
│    ]                                    │
│  })                                     │
└─────────────────────────────────────────┘
         │
         ├──> EventsModule (needs redis, kafka)
         ├──> PaymentsModule (needs stripe)
         └──> UsersModule (needs none of these!)
                 ↑ But still has access to ALL configs!
```

### After (Feature Modules)
```
┌─────────────────────────────────────────┐
│            AppModule                    │
│  ConfigModule.forRoot({                 │
│    load: [appConfig]  ← Only core app   │
│  })                                     │
└─────────────────────────────────────────┘
         │
         ├──> EventsModule
         │      imports: [RedisConfigModule, KafkaConfigModule]
         │      ↑ Only loads what it needs
         │
         ├──> PaymentsModule
         │      imports: [StripeConfigModule]
         │      ↑ Only loads what it needs
         │
         └──> UsersModule
                ↑ No config modules = no extra config loaded
```

## Implementation Pattern

### 1. Create Config File with `registerAs`
```typescript
// config/redis.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT ?? 6379),
}));
```

### 2. Create Dedicated Config Module
```typescript
// core/config-modules/redis-config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import redisConfig from '../../config/redis.config';

@Module({
  imports: [
    ConfigModule.forFeature(redisConfig),  // Feature-scoped config
  ],
  exports: [ConfigModule],  // Re-export for consumers
})
export class RedisConfigModule {}
```

### 3. Import Only Where Needed
```typescript
// modules/events/events.module.ts
import { RedisConfigModule } from '../../core/config-modules';

@Module({
  imports: [
    RedisConfigModule,  // Explicit dependency
  ],
  controllers: [EventsController],
})
export class EventsModule {}
```

### 4. Use ConfigService in Controllers/Services
```typescript
// modules/events/events.controller.ts
import { ConfigService } from '@nestjs/config';

@Controller()
export class EventsController {
  constructor(private configService: ConfigService) {}
  
  getRedisHost() {
    return this.configService.get('redis.host');
  }
}
```

## File Structure

```
src/
├── config/
│   ├── app.config.ts           # Core app config (loaded globally)
│   ├── redis.config.ts         # Redis config (loaded by RedisConfigModule)
│   ├── kafka.config.ts         # Kafka config (loaded by KafkaConfigModule)
│   └── validation.schema.ts    # Joi validation (global)
│
├── core/
│   └── config-modules/
│       ├── redis-config.module.ts    # Feature module for Redis config
│       ├── kafka-config.module.ts    # Feature module for Kafka config
│       └── index.ts                   # Re-export all config modules
│
├── modules/
│   ├── events/
│   │   └── events.module.ts    # Imports: RedisConfigModule, KafkaConfigModule
│   ├── payments/
│   │   └── payments.module.ts  # Imports: StripeConfigModule
│   └── users/
│       └── users.module.ts     # Imports: nothing (no extra config needed)
│
├── app.module.ts               # Only loads appConfig globally
└── main.ts                     # Bootstrap uses ConfigService
```

## Benefits Breakdown

### 1. **Lazy Loading**
```typescript
// Config only loaded when EventsModule is imported
@Module({
  imports: [RedisConfigModule],  // Loaded on-demand
})
export class EventsModule {}
```

### 2. **Explicit Dependencies**
```typescript
// Clear what configs each module needs
EventsModule -> RedisConfigModule, KafkaConfigModule
PaymentsModule -> StripeConfigModule
UsersModule -> (no config modules)
```

### 3. **Better Testing**
```typescript
// Test EventsModule with only Redis config, not everything
TestingModule.createTestingModule({
  imports: [
    RedisConfigModule,  // Only mock Redis config
  ],
  controllers: [EventsController],
});
```

### 4. **Tree Shaking**
```typescript
// If PaymentsModule is never imported, StripeConfigModule code is removed
// Smaller bundle size in production
```

### 5. **Modularity**
```typescript
// Each config module is self-contained
// Can be moved to separate npm packages if needed
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  exports: [ConfigModule],
})
export class RedisConfigModule {}  // Standalone, reusable
```

## Real-World Example

### Microservice with Optional Features

```typescript
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],  // Only core config
    }),
    
    // Conditionally import feature modules based on env
    ...(process.env.ENABLE_REDIS === 'true' ? [EventsModule] : []),
    ...(process.env.ENABLE_PAYMENTS === 'true' ? [PaymentsModule] : []),
  ],
})
export class AppModule {}

// EventsModule brings its own config
@Module({
  imports: [RedisConfigModule, KafkaConfigModule],
  controllers: [EventsController],
})
export class EventsModule {}
```

### Benefits:
- ✅ If `ENABLE_REDIS=false`, Redis config never loads
- ✅ Smaller memory footprint
- ✅ Faster startup time
- ✅ Clear feature flags

## Migration Guide

### Before: Global Loading
```typescript
// app.module.ts
ConfigModule.forRoot({
  isGlobal: true,
  load: [appConfig, redisConfig, kafkaConfig],
});

// events.module.ts
@Module({
  controllers: [EventsController],  // Implicitly uses global config
})
export class EventsModule {}
```

### After: Feature Modules
```typescript
// app.module.ts
ConfigModule.forRoot({
  isGlobal: true,
  load: [appConfig],  // Only core config
});

// core/config-modules/redis-config.module.ts
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  exports: [ConfigModule],
})
export class RedisConfigModule {}

// events.module.ts
@Module({
  imports: [RedisConfigModule, KafkaConfigModule],  // Explicit dependencies
  controllers: [EventsController],
})
export class EventsModule {}
```

## Key Takeaways

1. ✅ **Use `ConfigModule.forRoot()` only for core app config**
2. ✅ **Use `ConfigModule.forFeature()` for feature-specific configs**
3. ✅ **Create dedicated config modules** (e.g., RedisConfigModule)
4. ✅ **Import config modules only where needed**
5. ✅ **Export ConfigModule** from config modules for consumers
6. ✅ **Keep configs in `src/config/`**, modules in `src/core/config-modules/`

## Why This Matters

- **Performance**: Don't load configs for features you're not using
- **Maintainability**: Clear dependencies between modules
- **Testing**: Mock only what you need
- **Scalability**: Easy to add/remove features
- **Best Practices**: Follows NestJS official recommendations

This pattern is used by enterprise NestJS applications and is recommended in the official documentation!
