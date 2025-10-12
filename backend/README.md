# NestJS Learning Playground

My personal workspace for learning NestJS by following the official documentation.

## What This Is

Just me working through the NestJS docs and trying out different features. Not a real project, just learning examples.

## What I've Covered

**Overview:**
- ✅ First steps
- ✅ Controllers
- ✅ Providers
- ✅ Modules
- ✅ Middleware
- ✅ Exception filters
- ✅ Pipes
- ✅ Guards
- ✅ Interceptors
- ✅ Custom decorators

**Fundamentals:**
- ✅ Custom providers
- ✅ Asynchronous providers
- ✅ Dynamic modules
- ✅ Injection scopes
- ✅ Circular dependency
- ✅ Module reference
- ✅ Lazy-loading modules
- ✅ Execution context
- ✅ Lifecycle events
- ✅ Discovery service
- ✅ Platform agnosticism
- ✅ Testing

**Techniques:**
- ✅ Configuration

**Other:**
- ✅ Docker Setup
- ✅ Database (TypeORM + PostgreSQL)

## Setup

```bash
# Install
npm install

# Start database
docker-compose up -d

# Run the app
npm run start:dev
```

App runs on `http://localhost:3000`

## Example Endpoints

**Cats CRUD (sample module):**
- `POST /api/v1/cats` - Create a cat
- `GET /api/v1/cats` - Get all cats

```bash
# Create a cat
curl -X POST http://localhost:3000/api/v1/cats \
  -H "Content-Type: application/json" \
  -d '{"name":"Fluffy","age":2,"breed":"Maine Coon"}'

# Get all cats
curl http://localhost:3000/api/v1/cats
```

## Tech Stack

- NestJS 10.x
- PostgreSQL + TypeORM
- Docker
- Jest for testing

## Resources

- [NestJS Docs](https://docs.nestjs.com/)
- [TypeORM Docs](https://typeorm.io/)

---

Just learning by doing 🎓
