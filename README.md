# 🚀 NestJS Learning Playground# 🚀 NestJS Learning Playground



A comprehensive NestJS repository showcasing enterprise patterns, modular architecture, and best practices with PostgreSQL + TypeORM, Joi validation, and Docker setup.A comprehensive NestJS learning repository showcasing enterprise patterns, modular architecture, and best practices. Features PostgreSQL + TypeORM, Joi validation, configuration management, guards, pipes, interceptors, Docker setup, and testing.



## ✨ Features## 📋 Table of Contents

- [Features](#-features)

- **Complete NestJS App** - Modular architecture with real-world patterns- [Architecture](#-architecture)

- **PostgreSQL + TypeORM** - Database integration with auto-schema creation- [Quick Start](#-quick-start)

- **Joi Validation** - Environment variable validation with schemas- [Configuration](#-configuration)

- **Advanced Patterns** - Guards, pipes, interceptors, middleware, decorators- [API Endpoints](#-api-endpoints)

- **Docker Setup** - PostgreSQL containerization for easy development- [Testing](#-testing)

- **Testing** - Unit tests and E2E tests with Jest- [What You'll Learn](#-what-youll-learn)

- **Configuration** - Environment-based config management with namespaces

## ✨ Features

## 🏗️ Architecture

### Core NestJS Concepts

```- **Modular Architecture** - Clean separation of concerns

src/- **Dependency Injection** - Professional IoC patterns

├── config/          # Environment configs & validation- **Guards & Pipes** - Request validation and authentication

├── modules/         # Feature modules (cats, users, auth)- **Interceptors** - Response transformation and logging

├── shared/          # Common components (guards, pipes, interceptors)- **Middleware** - Custom request processing

└── main.ts          # Application bootstrap- **Exception Filters** - Centralized error handling

```

### Database & Validation

## 🚀 Quick Start- **PostgreSQL** with TypeORM integration



```bash- **Entity Management** - Auto-schema creation and migrations└── main.ts                       # Application bootstrap

# Clone and install

git clone https://github.com/TomerBeren/nestjs-learning-playground.git- **Joi Validation** - Environment variable validation```

cd nestjs-learning-playground

npm install- **Class Validators** - DTO validation patterns



# Start database## Key Concepts Demonstrated

docker-compose up -d

### Configuration & Deployment

# Run application

npm run start:dev- **Environment-based Config** - Dev/Prod/Test configurations### 1. Service with `@Injectable()`

```

- **Namespaced Configuration** - Modular config managementThe `CatsService` is decorated with `@Injectable()`, making it available for dependency injection:

**Visit:** http://localhost:3000/api/v1

- **Docker Setup** - PostgreSQL containerization

## 📡 Key Endpoints

- **Health Checks** - Application monitoring endpoints```typescript

- `GET /health` - Health check with database status

- `GET /api/v1/cats` - Sample CRUD operations@Injectable()

- `POST /api/v1/lazy-auth/login` - Lazy-loaded authentication

## 🏗️ Architectureexport class CatsService {

## 🎓 What You'll Learn

  private readonly cats: Cat[] = [];

- ✅ **NestJS Fundamentals** - Modules, controllers, services, DI

- ✅ **Advanced Patterns** - Guards, interceptors, pipes, middleware```

- ✅ **Database Integration** - TypeORM with PostgreSQL

- ✅ **Configuration** - Environment-based config with validationsrc/  create(cat: Cat) {

- ✅ **Testing** - Unit and E2E testing strategies

- ✅ **Enterprise Architecture** - Scalable, maintainable code structure├── config/                  # Configuration management    this.cats.push(cat);



## 🛠️ Tech Stack│   ├── app.config.ts       # Application settings  }



**Framework:** NestJS 10.x | **Database:** PostgreSQL 15 | **ORM:** TypeORM | **Validation:** Joi | **Testing:** Jest | **Container:** Docker│   ├── database.config.ts  # Database configuration



---│   ├── auth.config.ts      # Authentication settings  findAll(): Cat[] {



Perfect for learning NestJS through hands-on examples and real-world patterns! 🎉│   ├── features.config.ts  # Feature flags    return this.cats;

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