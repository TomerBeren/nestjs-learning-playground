# 🚀 NestJS Learning Playground# NestJS Providers Example



A comprehensive NestJS learning repository showcasing enterprise patterns, modular architecture, and best practices. Features PostgreSQL + TypeORM, Joi validation, configuration management, guards, pipes, interceptors, Docker setup, and testing.This is a simple NestJS application that demonstrates the concept of **Providers** as described in the [NestJS documentation](https://docs.nestjs.com/providers).



## 📋 Table of Contents## What This App Demonstrates

- [Features](#-features)

- [Architecture](#-architecture)This example shows:

- [Quick Start](#-quick-start)

- [Configuration](#-configuration)1. **Dependency Injection**: How services are injected into controllers

- [API Endpoints](#-api-endpoints)2. **Providers**: How to create and register services as providers

- [Testing](#-testing)3. **The `@Injectable()` decorator**: Making classes available for dependency injection

- [What You'll Learn](#-what-youll-learn)4. **Basic CRUD operations**: Create and read cats using a service



## ✨ Features## Project Structure



### Core NestJS Concepts```

- **Modular Architecture** - Clean separation of concernssrc/

- **Dependency Injection** - Professional IoC patterns├── cats/

- **Guards & Pipes** - Request validation and authentication│   ├── dto/

- **Interceptors** - Response transformation and logging│   │   └── create-cat.dto.ts      # Data Transfer Object for creating cats

- **Middleware** - Custom request processing│   ├── interfaces/

- **Exception Filters** - Centralized error handling│   │   └── cat.interface.ts       # Cat interface definition

│   ├── cats.controller.ts         # HTTP controller for cat endpoints

### Database & Validation│   └── cats.service.ts            # Business logic for cat operations

- **PostgreSQL** with TypeORM integration├── app.module.ts                  # Root module that registers providers

- **Entity Management** - Auto-schema creation and migrations└── main.ts                       # Application bootstrap

- **Joi Validation** - Environment variable validation```

- **Class Validators** - DTO validation patterns

## Key Concepts Demonstrated

### Configuration & Deployment

- **Environment-based Config** - Dev/Prod/Test configurations### 1. Service with `@Injectable()`

- **Namespaced Configuration** - Modular config managementThe `CatsService` is decorated with `@Injectable()`, making it available for dependency injection:

- **Docker Setup** - PostgreSQL containerization

- **Health Checks** - Application monitoring endpoints```typescript

@Injectable()

## 🏗️ Architectureexport class CatsService {

  private readonly cats: Cat[] = [];

```

src/  create(cat: Cat) {

├── config/                  # Configuration management    this.cats.push(cat);

│   ├── app.config.ts       # Application settings  }

│   ├── database.config.ts  # Database configuration

│   ├── auth.config.ts      # Authentication settings  findAll(): Cat[] {

│   ├── features.config.ts  # Feature flags    return this.cats;

│   └── validation.schema.ts # Joi validation schema  }

├── modules/                 # Feature modules}

│   ├── cats/               # Sample CRUD module```

│   ├── users/              # User management

│   └── auth/               # Authentication (lazy-loaded)### 2. Constructor-based Dependency Injection

├── shared/                 # Shared componentsThe `CatsController` receives the `CatsService` through its constructor:

│   ├── common/             # Guards, pipes, interceptors

│   │   ├── decorators/     # Custom decorators```typescript

│   │   ├── guards/         # Authentication guards@Controller('cats')

│   │   ├── interceptors/   # Response interceptorsexport class CatsController {

│   │   ├── middleware/     # Custom middleware  constructor(private catsService: CatsService) {}

│   │   └── pipes/          # Validation pipes  // ...

│   └── database/           # Database module}

└── main.ts                 # Application bootstrap```

```

### 3. Provider Registration

## 🚀 Quick StartBoth the controller and service are registered in the `AppModule`:



### Prerequisites```typescript

- Node.js 18+ @Module({

- Docker & Docker Compose  controllers: [CatsController],

- Git  providers: [CatsService],

})

### Installationexport class AppModule {}

```

1. **Clone the repository**

   ```bash## How to Run

   git clone https://github.com/TomerBeren/nestjs-learning-playground.git

   cd nestjs-learning-playground1. Install dependencies:

   ```   ```bash

   npm install

2. **Install dependencies**   ```

   ```bash

   npm install2. Start the development server:

   ```   ```bash

   npm run start:dev

3. **Start PostgreSQL database**   ```

   ```bash

   docker-compose up -d3. The server will start on `http://localhost:3000`

   ```

## API Endpoints

4. **Run the application**

   ```bash- **POST /cats** - Create a new cat

   npm run start:dev  ```json

   ```  {

    "name": "Whiskers",

5. **Visit the application**    "age": 3,

   - API: http://localhost:3000/api/v1    "breed": "Persian"

   - Health Check: http://localhost:3000/health  }

  ```

## ⚙️ Configuration

- **GET /cats** - Get all cats

### Environment Files  ```json

Configuration is managed through environment-specific files:  [

    {

- `config/development.env` - Development settings      "name": "Whiskers",

- `config/production.env` - Production settings        "age": 3,

- `config/test.env` - Test settings      "breed": "Persian"

    }

### Key Environment Variables  ]

```bash  ```

# Application

NODE_ENV=development## Testing the API

PORT=3000

HOST=localhostYou can test the API using curl:

API_PREFIX=api/v1

```bash

# Database# Create a cat

DB_HOST=localhostcurl -X POST http://localhost:3000/cats \\

DB_PORT=5432  -H "Content-Type: application/json" \\

DB_NAME=nestdocs  -d '{"name":"Fluffy","age":2,"breed":"Maine Coon"}'

DB_USER=postgres

DB_PASSWORD=password# Get all cats

curl http://localhost:3000/cats

# JWT```

JWT_SECRET=your-super-secret-jwt-key-here

JWT_EXPIRES_IN=3600s## Learning Resources



# Features- [NestJS Providers Documentation](https://docs.nestjs.com/providers)

CORS_ENABLED=true- [Dependency Injection in NestJS](https://docs.nestjs.com/fundamentals/dependency-injection)

```- [NestJS Controllers](https://docs.nestjs.com/controllers)

## 📡 API Endpoints

### Application
- `GET /` - Welcome message
- `GET /health` - Health check with database status

### Cats Module (Sample CRUD)
- `POST /api/v1/cats` - Create a cat
- `GET /api/v1/cats` - List all cats
- `GET /api/v1/cats/:id` - Get cat by ID
- `GET /api/v1/cats/stats` - Get cat statistics

### Authentication (Lazy-loaded)
- `POST /api/v1/lazy-auth/login` - User login
- `POST /api/v1/lazy-auth/validate` - Validate credentials
- `GET /api/v1/lazy-auth/profile` - User profile
- `GET /api/v1/lazy-auth/status` - Auth status

## 🧪 Testing

```bash
# Unit tests
npm run test

# End-to-end tests  
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🎓 What You'll Learn

### Beginner Concepts
- [x] **Module System** - How to organize code into modules
- [x] **Controllers** - Handling HTTP requests and responses
- [x] **Services** - Business logic and dependency injection
- [x] **DTOs** - Data transfer objects and validation

### Intermediate Concepts
- [x] **Guards** - Authentication and authorization
- [x] **Pipes** - Data transformation and validation
- [x] **Interceptors** - Request/response transformation
- [x] **Middleware** - Custom request processing
- [x] **Exception Filters** - Error handling

### Advanced Concepts
- [x] **Configuration Management** - Environment-based config
- [x] **Database Integration** - TypeORM with PostgreSQL
- [x] **Lazy Loading** - Dynamic module loading
- [x] **Testing Strategies** - Unit and E2E testing
- [x] **Docker Integration** - Containerized development

### Enterprise Patterns
- [x] **Modular Architecture** - Scalable code organization
- [x] **Configuration Namespaces** - Modular config management
- [x] **Health Checks** - Application monitoring
- [x] **Validation Schemas** - Joi and Class-Validator
- [x] **Error Handling** - Centralized exception management

## 🛠️ Tech Stack

- **Framework**: NestJS 10.x
- **Runtime**: Node.js 18+
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **Validation**: Joi + Class-Validator
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose

## 📚 Learning Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Joi Validation](https://joi.dev/)
- [Docker Documentation](https://docs.docker.com/)

## 🤝 Contributing

This is a learning repository! Feel free to:
- Open issues for questions
- Submit PRs with improvements
- Share your learning experiences
- Suggest additional examples

## 📄 License

MIT License - feel free to use this for learning and building awesome applications!

---

**Happy Learning! 🎉**

*This repository demonstrates real-world NestJS patterns used in production applications. Each feature is documented and explained to help you understand not just how, but why.*