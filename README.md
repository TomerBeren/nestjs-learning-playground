# NestDocs - Full Stack Application

A full-stack application with NestJS backend and Angular frontend.

## 📁 Project Structure

```
nestdocs/
├── backend/           # NestJS Backend API
│   ├── src/          # Source code
│   ├── config/       # Configuration files
│   ├── docs/         # Documentation
│   └── test/         # Tests
│
├── frontend/          # Angular Frontend
│   └── nestdocs-app/ # Angular application
│       ├── src/      # Source code
│       └── public/   # Public assets
│
└── README.md         # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v22+)
- npm (v11+)
- Docker & Docker Compose (for backend services)
- Angular CLI (v20+)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start Docker services (PostgreSQL, Redis, Kafka)
docker-compose up -d

# Run in development mode
npm run start:dev

# Backend runs on http://localhost:3000
```

### Frontend Setup

```bash
cd frontend/nestdocs-app

# Install dependencies
npm install

# Run development server
ng serve

# Frontend runs on http://localhost:4200
```

## 📚 Backend Documentation

The backend is a hybrid NestJS application supporting:

- ✅ **HTTP REST API** - Traditional REST endpoints
- ✅ **GraphQL** - Query language for your API
- ✅ **WebSocket** - Real-time bidirectional communication
- ✅ **Redis Microservices** - Message patterns for inter-service communication
- ✅ **Kafka Microservices** - Event streaming for distributed systems

### Backend Features

- **Authentication** - JWT-based auth with bcrypt password hashing
- **Database** - TypeORM with PostgreSQL
- **GraphQL** - Apollo Server with subscriptions
- **WebSocket** - Socket.IO for real-time events
- **Redis** - Message queue and caching
- **Kafka** - Event streaming and async processing
- **Docker** - Full containerization with hot reload
- **Testing** - Unit tests and E2E tests

### Backend Documentation Files

- `KAFKA_MICROSERVICES_GUIDE.md` - Kafka integration guide
- `KAFKA_SELF_COMMUNICATION_TEST.md` - Kafka testing guide
- `REDIS_MICROSERVICES_GUIDE.md` - Redis integration guide
- `WEBSOCKET_TEST_GUIDE.md` - WebSocket testing guide
- `docs/AUTHENTICATION_TESTING.md` - Auth testing guide
- `docs/CONFIGURATION_ARCHITECTURE.md` - Config patterns

## 🎨 Frontend Documentation

The frontend is built with Angular 20 using:

- ✅ **Standalone Components** - Modern Angular architecture
- ✅ **TypeScript** - Type-safe development
- ✅ **SCSS** - Powerful CSS preprocessing
- ✅ **Routing** - Angular Router for navigation

### Frontend Features

Fresh Angular 20 application ready for:
- HTTP client integration with backend API
- WebSocket client for real-time features
- GraphQL client (Apollo Angular)
- Modern component architecture
- Reactive forms and state management

## 🔗 API Endpoints

### Backend API Base URL
```
http://localhost:3000/api/v1
```

### Main Endpoints

- **Cats API**: `/api/v1/cats`
- **Auth API**: `/api/v1/auth`
- **GraphQL**: `/graphql`
- **WebSocket**: `ws://localhost:3000/events`
- **Kafka Test**: `/api/v1/kafka-test`

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Test Scripts

- `test-api.ps1` - Test REST API endpoints
- `test-auth.ps1` - Test authentication
- `test-kafka.ps1` - Test Kafka messaging

### Frontend Tests

```bash
cd frontend/nestdocs-app

# Unit tests
ng test

# E2E tests
ng e2e
```

## 🐳 Docker Services

The backend uses Docker Compose for development:

```yaml
services:
  - postgres:15     # Database
  - redis:7-alpine  # Cache & Message Queue
  - kafka:7.5.0     # Event Streaming
  - zookeeper:7.5.0 # Kafka Coordinator
```

Start all services:
```bash
cd backend
docker-compose up -d
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (Angular)                 │
│              http://localhost:4200                  │
└────────────┬────────────────────────────────────────┘
             │
             │ HTTP/REST, GraphQL, WebSocket
             │
┌────────────▼────────────────────────────────────────┐
│              Backend (NestJS)                       │
│            http://localhost:3000                    │
│                                                     │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐          │
│  │   HTTP  │  │ GraphQL │  │WebSocket │          │
│  │   REST  │  │  API    │  │ Gateway  │          │
│  └─────────┘  └─────────┘  └──────────┘          │
│                                                     │
│  ┌─────────┐  ┌─────────┐                         │
│  │  Redis  │  │  Kafka  │                         │
│  │ Consumer│  │ Consumer│                         │
│  └─────────┘  └─────────┘                         │
└────────────┬────────────────────────────────────────┘
             │
             │ Docker Compose Network
             │
┌────────────▼────────────────────────────────────────┐
│          Infrastructure Services                    │
│                                                     │
│  ┌───────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │PostgreSQL │  │  Redis  │  │  Kafka + ZK     │ │
│  │   :5432   │  │  :6379  │  │  :9092 :2181    │ │
│  └───────────┘  └─────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## 📝 Development Workflow

### 1. Start Backend Services
```bash
cd backend
docker-compose up -d
npm run start:dev
```

### 2. Start Frontend Dev Server
```bash
cd frontend/nestdocs-app
ng serve
```

### 3. Access Applications
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api/v1
- GraphQL Playground: http://localhost:3000/graphql
- WebSocket Test: http://localhost:3000/websocket-test.html

## 🔐 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=nestdocs

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Kafka
KAFKA_BROKERS=localhost:9092

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
```

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 10.4.20
- **Language**: TypeScript 5.6
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **GraphQL**: Apollo Server
- **WebSocket**: Socket.IO
- **Message Queue**: Redis, Kafka
- **Validation**: class-validator, class-transformer
- **Testing**: Jest

### Frontend
- **Framework**: Angular 20.2
- **Language**: TypeScript
- **Styling**: SCSS
- **Build**: Angular CLI
- **Testing**: Jasmine, Karma

## 📦 Scripts

### Backend Scripts
```bash
npm run start         # Start production
npm run start:dev     # Start development with hot reload
npm run start:debug   # Start with debugging
npm run build         # Build for production
npm run test          # Run unit tests
npm run test:e2e      # Run E2E tests
```

### Frontend Scripts
```bash
ng serve              # Start dev server
ng build              # Build for production
ng test               # Run unit tests
ng lint               # Lint code
```

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests
4. Submit a pull request

## 📄 License

This project is for learning purposes.

## 🎓 Learning Resources

This project demonstrates:
- Full-stack TypeScript development
- Microservices architecture
- Event-driven patterns
- Real-time communication
- Modern Angular & NestJS patterns
- Docker containerization
- GraphQL API design
- WebSocket implementation
- Message queues & event streams

---

**Happy Coding! 🚀**
