# Authentication Testing with cURL

## Prerequisites
Make sure your NestJS server is running:
```bash
npm run start:dev
```

The server should be available at `http://localhost:3000`

## Step 1: Create a Test User

First, create a user named "john" with password "changeme":

```bash
curl -X POST http://localhost:3000/api/v1/users `
  -H "Content-Type: application/json" `
  -d '{"username":"john","firstName":"John","lastName":"Doe","password":"changeme","isActive":true}'
```

**Expected Response:**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "username": "john",
  "isActive": true
}
```
Note: The password field is excluded from the response for security.

## Step 2: Login and Get JWT Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"john","password":"changeme"}'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiam9obiIsImlhdCI6MTcyODI0NTY4MCwiZXhwIjoxNzI4MjQ1NzQwfQ...."
}
```

**Copy the `access_token` for the next step!**

## Step 3: Access Protected Route

Replace `YOUR_TOKEN_HERE` with the token from Step 2:

```bash
curl -X GET http://localhost:3000/api/v1/auth/profile `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "username": "john",
    "isActive": true
  }
}
```

## Step 4: Test Invalid Credentials

```bash
curl -X POST http://localhost:3000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"john","password":"wrongpassword"}'
```

**Expected Response:**
```json
null
```
(Returns null for invalid credentials)

## Step 5: Test Invalid Token

```bash
curl -X GET http://localhost:3000/api/v1/auth/profile `
  -H "Authorization: Bearer invalidtoken123"
```

**Expected Response:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Using PowerShell Script

Alternatively, run the automated test script:

```powershell
.\test-auth.ps1
```

This will run all the tests above automatically and show you the results.

## Understanding the Flow

1. **User Registration**: Password is hashed with bcrypt (10 rounds) via `UserSubscriber` before being stored
2. **Login**: `AuthService.validateUser()` compares the plain password with hashed password using bcrypt
3. **Token Generation**: JWT is created with payload `{ sub: userId, username: username }` and signed with the secret
4. **Token Verification**: `jwtService.verifyAsync()` validates and decodes the token
5. **Protected Routes**: Extract token from `Authorization: Bearer <token>` header and verify

## JWT Configuration

Token expires in **60 seconds** (configured in `auth.module.ts`):
```typescript
JwtModule.register({
  secret: jwtConstants.secret,
  signOptions: { expiresIn: '60s' },
})
```

To change expiration, modify the `expiresIn` value (e.g., `'1h'`, `'7d'`, `'30d'`).

## Security Notes

- ✅ Passwords are hashed with bcrypt (salt rounds: 10)
- ✅ Passwords are never returned in API responses (`@Exclude()` decorator)
- ✅ JWT tokens are signed and verified
- ✅ Tokens expire after 60 seconds
- ⚠️ In production, use environment variables for JWT secret
- ⚠️ Consider using refresh tokens for longer sessions
