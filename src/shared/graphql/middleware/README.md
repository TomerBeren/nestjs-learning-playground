# GraphQL Field Middleware

Field middleware in GraphQL allows you to intercept and transform field values before they are returned to the client.

## Available Middleware

### 1. `uppercaseMiddleware`

Converts string field values to uppercase.

**Use Case:** Ensure consistent text formatting (e.g., country codes, status values)

**Example:**
```typescript
import { uppercaseMiddleware } from '../../../shared/graphql/middleware';

@ObjectType()
export class Author {
  @Field({ middleware: [uppercaseMiddleware] })
  firstName: string;  // "john" becomes "JOHN"
}
```

### 2. `logFieldAccessMiddleware`

Logs when fields are accessed and their resolved values.

**Use Case:** Debugging, performance monitoring, audit trails

**Example:**
```typescript
import { logFieldAccessMiddleware } from '../../../shared/graphql/middleware';

@ObjectType()
export class Comment {
  @Field({ middleware: [logFieldAccessMiddleware] })
  text: string;  // Logs: [Field Access] Comment.text
}
```

**Console Output:**
```
[Field Access] Comment.text
[Field Value] Comment.text = "This is a comment"
```

### 3. `checkRoleMiddleware` ⭐ NEW

Implements field-level role-based access control (RBAC).

**Use Case:** Restrict sensitive fields to users with specific roles

**Role Hierarchy:** ADMIN > MODERATOR > USER

**Example:**
```typescript
import { checkRoleMiddleware } from '../../../shared/graphql/middleware';
import { Role } from '../../../core/common/enums/role.enum';

@ObjectType()
export class Author {
  @Field()
  firstName: string;  // Public field

  @Field({ 
    middleware: [checkRoleMiddleware],
    description: 'Only accessible by MODERATOR and ADMIN'
  })
  @Extensions({ role: Role.MODERATOR })
  email: string;  // Protected field
}
```

**Behavior:**
- ✅ ADMIN can access all fields (USER, MODERATOR, ADMIN)
- ✅ MODERATOR can access USER and MODERATOR fields
- ✅ USER can only access USER fields
- ❌ Lower roles accessing higher fields → `ForbiddenException`

**Real-World Example:**
```typescript
@ObjectType()
export class UserType {
  @Field()
  username: string;  // Public

  @Field({ middleware: [checkRoleMiddleware] })
  @Extensions({ role: Role.MODERATOR })
  isActive: boolean;  // Moderators can see user status

  @Field({ middleware: [checkRoleMiddleware] })
  @Extensions({ role: Role.ADMIN })
  password: string;  // Only admins can see passwords
}
```

**Error Response:**
```json
{
  "errors": [{
    "message": "Insufficient permissions to access \"password\" field. Required role: ADMIN"
  }]
}
```

## How Field Middleware Works

```typescript
export const myMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  // 1. Before resolution (you can access context)
  console.log('Field:', ctx.info.fieldName);
  
  // 2. Call next() to get the actual field value
  const value = await next();
  
  // 3. After resolution (you can transform the value)
  return value.toUpperCase();
};
```

## Middleware Context

The `MiddlewareContext` provides:
- `info`: GraphQL resolve info (field name, parent type, etc.)
- `source`: Parent object
- `args`: Field arguments
- `context`: GraphQL context (user, request, etc.)

## Creating Custom Middleware

```typescript
import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const trimMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const value = await next();
  
  if (typeof value === 'string') {
    return value.trim();
  }
  
  return value;
};
```

## Chaining Multiple Middleware

```typescript
@Field({ 
  middleware: [
    trimMiddleware,
    uppercaseMiddleware,
    logFieldAccessMiddleware
  ] 
})
firstName: string;
```

**Execution Order:** Left to right (trimMiddleware → uppercaseMiddleware → logFieldAccessMiddleware)

## Applied Examples in This Project

### Author Model
- `firstName` and `lastName` use `uppercaseMiddleware`
  - All author names will be returned in uppercase
- `email` field uses `checkRoleMiddleware` with `@Extensions({ role: Role.MODERATOR })`
  - Only MODERATOR and ADMIN users can access author emails

### Comment Model  
- `text` field uses `logFieldAccessMiddleware`
  - Every time a comment's text is accessed, it's logged to the console

### User Model
- `password` field uses `checkRoleMiddleware` with `@Extensions({ role: Role.ADMIN })`
  - Only ADMIN users can access password fields
- `isActive` field uses `checkRoleMiddleware` with `@Extensions({ role: Role.MODERATOR })`
  - Only MODERATOR and ADMIN users can see user status

## Testing

Run tests for field middleware:
```bash
npm test -- middleware.spec.ts
npm test -- check-role.middleware.spec.ts
```

All middleware includes comprehensive unit tests covering:
- ✅ Normal string values
- ✅ Non-string values (numbers, objects, arrays)
- ✅ Null and undefined values
- ✅ Role hierarchy (ADMIN > MODERATOR > USER)
- ✅ Permission checks (allow/deny)
- ✅ Edge cases

## Performance Considerations

- Field middleware runs **every time** a field is resolved
- Keep middleware lightweight
- Avoid async operations unless necessary
- Use for:
  - ✅ Simple transformations (uppercase, trim, format)
  - ✅ Logging and monitoring
  - ✅ Authorization checks
  - ❌ Heavy computations
  - ❌ Database queries (use resolvers instead)

## Best Practices

1. **Keep it pure:** Middleware should not have side effects (except logging)
2. **Type safety:** Always check value types before transformation
3. **Error handling:** Wrap in try/catch if needed
4. **Reusability:** Create generic middleware that works across different fields
5. **Documentation:** Comment why middleware is applied to specific fields
