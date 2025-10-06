# Bcrypt Password Hashing

This project uses bcrypt for secure password hashing. Bcrypt is a password-hashing function designed to be computationally expensive, making it resistant to brute-force attacks.

## Overview

The `BcryptUtil` utility class provides a clean, simple interface for common bcrypt operations:

- **Hashing passwords** before storing them in the database
- **Comparing passwords** during authentication
- **Generating salts** for manual hashing operations

## Usage

### Automatic Password Hashing (UserSubscriber)

Passwords are automatically hashed before being inserted into the database using a TypeORM subscriber:

```typescript
// src/modules/users/subscribers/user.subscriber.ts
async beforeInsert(event: InsertEvent<User>): Promise<void> {
  if (event.entity.password) {
    event.entity.password = await BcryptUtil.hashPassword(event.entity.password);
  }
}
```

This means when you create a user:
```typescript
const user = await usersService.create({
  username: 'john',
  password: 'myPlainTextPassword', // This will be automatically hashed
  // ... other fields
});
```

### Password Validation (AuthService)

During authentication, passwords are compared using bcrypt:

```typescript
// src/modules/auth/auth.service.ts
const isPasswordValid = await BcryptUtil.comparePassword(
  plainTextPassword,
  hashedPasswordFromDB
);

if (!isPasswordValid) {
  throw new UnauthorizedException();
}
```

## BcryptUtil API

### `hashPassword(password: string): Promise<string>`

Hashes a plain text password with a salt round of 10.

```typescript
import { BcryptUtil } from '@/core/common/utils';

const hashedPassword = await BcryptUtil.hashPassword('mySecurePassword');
// Returns: '$2b$10$...' (60 character hash)
```

### `comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean>`

Compares a plain text password with a hashed password.

```typescript
const isMatch = await BcryptUtil.comparePassword(
  'userInput',
  storedHashedPassword
);
// Returns: true if passwords match, false otherwise
```

### `generateSalt(rounds?: number): Promise<string>`

Generates a salt for manual hashing operations (advanced usage).

```typescript
const salt = await BcryptUtil.generateSalt(12); // Custom rounds
// Returns: '$2b$12$...'
```

## Security Features

- **Salt Rounds**: Uses 10 rounds by default (configurable), providing strong protection against rainbow table attacks
- **Automatic Salting**: Each password gets a unique salt, preventing identical passwords from producing the same hash
- **One-Way Hash**: Passwords cannot be decrypted, only compared
- **Slow by Design**: Bcrypt is intentionally slow to make brute-force attacks impractical

## Configuration

The default salt rounds (10) can be found in:
```typescript
// src/core/common/utils/bcrypt.util.ts
private static readonly SALT_ROUNDS = 10;
```

Higher values (11, 12, etc.) increase security but also increase computation time.

## Example: Full Authentication Flow

1. **User Registration**:
   ```typescript
   // User inputs password: "myPassword123"
   const user = usersService.create({
     username: 'john',
     password: 'myPassword123' // Plain text
   });
   // UserSubscriber automatically hashes it before DB insert
   // Stored in DB: '$2b$10$xyz...'
   ```

2. **User Login**:
   ```typescript
   // User inputs password: "myPassword123"
   const user = await usersService.findByUsername('john');
   // user.password = '$2b$10$xyz...' (from DB)
   
   const isValid = await BcryptUtil.comparePassword(
     'myPassword123',  // User input
     user.password     // Hashed password from DB
   );
   // Returns: true (passwords match)
   ```

## Testing

All bcrypt functionality is mocked in tests to avoid slow hashing operations:

```typescript
jest.mock('bcrypt');

(BcryptUtil.hashPassword as jest.Mock).mockResolvedValue('$2b$10$mockHash');
(BcryptUtil.comparePassword as jest.Mock).mockResolvedValue(true);
```

See test files for examples:
- `src/core/common/utils/bcrypt.util.spec.ts`
- `src/modules/users/subscribers/user.subscriber.spec.ts`
- `src/modules/auth/auth.service.spec.ts`
