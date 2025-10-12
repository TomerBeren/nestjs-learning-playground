# 🚀 Quick Setup Guide

## Project Structure

```
nestdocs/
├── backend/          # NestJS API
│   ├── src/         # Backend source code
│   ├── config/      # Environment configs
│   └── docs/        # Backend documentation
│
├── frontend/        # Angular Application
│   └── nestdocs-app/
│       └── src/     # Frontend source code
│
├── README.md        # Main documentation
└── SETUP.md         # This file
```

---

## 🏃‍♂️ Quick Start

### 1️⃣ Start Backend (NestJS)

```powershell
# Navigate to backend
cd backend

# Install dependencies (if not already done)
npm install

# Start Docker services
docker-compose up -d

# Start development server
npm run start:dev
```

**Backend runs on:** `http://localhost:3000`

### 2️⃣ Start Frontend (Angular)

```powershell
# Open new terminal
# Navigate to frontend
cd frontend/nestdocs-app

# Install dependencies
npm install

# Start development server
ng serve
```

**Frontend runs on:** `http://localhost:4200`

---

## 📍 Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:4200 | Angular UI |
| **Backend API** | http://localhost:3000/api/v1 | REST API |
| **GraphQL** | http://localhost:3000/graphql | GraphQL Playground |
| **WebSocket Test** | http://localhost:3000/websocket-test.html | WebSocket Testing |
| **Kafka Test** | http://localhost:3000/api/v1/kafka-test | Kafka Endpoints |

---

## 🐳 Docker Services

The backend uses these containerized services:

| Service | Port | Status Check |
|---------|------|--------------|
| PostgreSQL | 5432 | `docker ps \| grep postgres` |
| Redis | 6379 | `docker ps \| grep redis` |
| Kafka | 9092 | `docker ps \| grep kafka` |
| Zookeeper | 2181 | `docker ps \| grep zookeeper` |

### Docker Commands

```powershell
# Start all services
cd backend
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Check service health
docker-compose ps
```

---

## 🔧 Development Workflow

### Typical Development Session

1. **Start Docker Services**
   ```powershell
   cd backend
   docker-compose up -d
   ```

2. **Start Backend**
   ```powershell
   # Same terminal
   npm run start:dev
   ```

3. **Start Frontend (New Terminal)**
   ```powershell
   cd frontend/nestdocs-app
   ng serve
   ```

4. **Open Browser**
   - Frontend: http://localhost:4200
   - Backend: http://localhost:3000/api/v1

---

## 📦 NPM Scripts

### Backend Scripts

```powershell
cd backend

npm run start         # Production mode
npm run start:dev     # Development with hot reload
npm run start:debug   # Debug mode
npm run build         # Build for production
npm run test          # Run unit tests
npm run test:e2e      # Run E2E tests
npm run test:cov      # Test coverage
```

### Frontend Scripts

```powershell
cd frontend/nestdocs-app

ng serve              # Start dev server
ng build              # Build for production
ng test               # Run unit tests
ng lint               # Lint code
ng generate component <name>  # Generate component
```

---

## 🧪 Testing

### Backend Testing

```powershell
cd backend

# Run all unit tests
npm test

# E2E tests
npm run test:e2e

# Test API with PowerShell scripts
.\test-api.ps1        # Test REST endpoints
.\test-auth.ps1       # Test authentication
.\test-kafka.ps1      # Test Kafka messaging
```

### Frontend Testing

```powershell
cd frontend/nestdocs-app

# Unit tests
ng test

# E2E tests
ng e2e
```

---

## 🔑 Environment Variables

### Backend Environment

Create or edit `backend/config/development.env`:

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
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1h

# App
NODE_ENV=development
PORT=3000
```

---

## 🛠️ Troubleshooting

### Backend Issues

**Problem:** Docker services won't start
```powershell
# Solution: Reset Docker
docker-compose down -v
docker-compose up -d
```

**Problem:** Port 3000 already in use
```powershell
# Solution: Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Problem:** Kafka connection errors
```powershell
# Solution: Check Kafka is running
docker ps | grep kafka
docker-compose restart kafka
```

### Frontend Issues

**Problem:** Port 4200 already in use
```powershell
# Solution: Use different port
ng serve --port 4201
```

**Problem:** Module not found errors
```powershell
# Solution: Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation

### Backend Documentation
- `backend/README.md` - Backend overview
- `backend/KAFKA_MICROSERVICES_GUIDE.md` - Kafka setup
- `backend/REDIS_MICROSERVICES_GUIDE.md` - Redis setup
- `backend/WEBSOCKET_TEST_GUIDE.md` - WebSocket guide
- `backend/docs/` - Additional docs

### Frontend Documentation
- `frontend/nestdocs-app/README.md` - Angular app docs

---

## 🎯 Next Steps

### For Backend Development
1. Create new modules: `nest g module <name>`
2. Add API endpoints in controllers
3. Implement business logic in services
4. Test with PowerShell scripts

### For Frontend Development
1. Generate components: `ng g component <name>`
2. Create services: `ng g service <name>`
3. Connect to backend API
4. Style with SCSS

### Integration
1. **HTTP Client**: Use Angular HttpClient to call backend REST API
2. **WebSocket**: Connect to Socket.IO gateway for real-time features
3. **GraphQL**: Install Apollo Angular for GraphQL queries
4. **State Management**: Consider NgRx for complex state

---

## 🚀 Production Deployment

### Backend
```powershell
cd backend
npm run build
npm run start:prod
```

### Frontend
```powershell
cd frontend/nestdocs-app
ng build --configuration production
# Serve the dist/ folder with nginx or similar
```

---

## 📞 Common Commands Quick Reference

```powershell
# Backend
cd backend && docker-compose up -d && npm run start:dev

# Frontend
cd frontend/nestdocs-app && ng serve

# Both (run in separate terminals)
# Terminal 1:
cd backend && npm run start:dev

# Terminal 2:
cd frontend/nestdocs-app && ng serve
```

---

**Happy Coding! 🎉**

For more details, see the main [README.md](README.md)
