# Redis Microservices Guide

## 🚀 Quick Start

### 1. Start Redis with Docker
```bash
docker-compose up -d redis
```

### 2. Start Your NestJS App
```bash
npm run start:dev
```

You should see:
```
🔴 Redis microservice started on localhost:6379
```

---

## 📡 How It Works

### Architecture Overview
```
┌─────────────────────────────────────┐
│      Your NestJS Application        │
│  ┌────────────┐    ┌──────────────┐ │
│  │   HTTP     │    │  WebSockets  │ │
│  │  REST API  │    │  Socket.IO   │ │
│  └────────────┘    └──────────────┘ │
│         │                  │         │
│         └──────┬───────────┘         │
│                │                     │
│    ┌───────────▼──────────────┐     │
│    │  Redis Microservice      │     │
│    │  (Message Broker)        │     │
│    └──────────────────────────┘     │
└─────────────┬───────────────────────┘
              │
              ▼
      ┌───────────────┐
      │     Redis     │
      │   (Port 6379) │
      └───────────────┘
```

### Two Communication Patterns

#### 1. **Message Pattern** (Request/Response)
- Client sends a message and **waits** for a response
- Synchronous communication
- Use case: Fetching data, calculations, queries

```typescript
@MessagePattern('get_user')
getUser(@Payload() data: any) {
  return { id: data.id, name: 'John Doe' };
}
```

#### 2. **Event Pattern** (Fire and Forget)
- Client sends an event and **doesn't wait**
- Asynchronous communication
- Use case: Notifications, logging, background tasks

```typescript
@EventPattern('user_created')
handleUserCreated(@Payload() data: any) {
  console.log('User created:', data);
  // No return value needed
}
```

---

## 🧪 Testing with Redis CLI

### Install Redis CLI
Already included if you're using Docker!

### Connect to Redis
```bash
docker exec -it nestdocs-redis redis-cli
```

Or if Redis is installed locally:
```bash
redis-cli
```

### Send a Message Pattern (Request/Response)
```bash
# In redis-cli:
PUBLISH get_user '{"id": 123}'
```

Your NestJS app will log:
```
[EventsController] 📨 Received message pattern 'get_user' with data: {"id":123}
```

### Send an Event Pattern (Fire and Forget)
```bash
# In redis-cli:
PUBLISH user_created '{"userId": 456, "email": "jane@example.com"}'
```

Your NestJS app will log:
```
[EventsController] 🎉 Event received: User created with data: {"userId":456,"email":"jane@example.com"}
```

### Test Calculate Sum
```bash
PUBLISH calculate_sum '{"numbers": [1, 2, 3, 4, 5]}'
```

### Test Notification
```bash
PUBLISH notification_sent '{"userId": 789, "type": "email", "message": "Welcome!"}'
```

---

## 🎯 Real-World Use Cases

### 1. **Microservices Architecture**
Split your monolith into services:
- **Auth Service** - Handles authentication
- **User Service** - Manages users
- **Email Service** - Sends emails
- **Analytics Service** - Tracks events

All communicate via Redis!

### 2. **Background Job Processing**
```typescript
@EventPattern('send_email')
async handleSendEmail(@Payload() data: { to: string, subject: string }) {
  // Send email asynchronously
  await this.emailService.send(data);
}
```

Trigger from anywhere:
```typescript
this.client.emit('send_email', { 
  to: 'user@example.com', 
  subject: 'Welcome!' 
});
```

### 3. **Event-Driven Architecture**
```typescript
// When user registers
@Post('register')
async register(@Body() dto: RegisterDto) {
  const user = await this.authService.register(dto);
  
  // Fire events (non-blocking)
  this.client.emit('user_created', { userId: user.id });
  this.client.emit('send_welcome_email', { email: user.email });
  this.client.emit('track_signup', { userId: user.id });
  
  return user;
}
```

### 4. **Inter-Service Communication**
```typescript
// Service A asks Service B for data
const userData = await this.client
  .send('get_user', { id: 123 })
  .toPromise();
```

---

## 🔧 Configuration

### Docker Compose Setup
```yaml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  command: redis-server --appendonly yes
```

### NestJS Configuration
```typescript
// main.ts
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.REDIS,
  options: {
    host: 'localhost',
    port: 6379,
  },
});

await app.startAllMicroservices();
```

---

## 📊 Available Endpoints

### Message Patterns (Request/Response)
| Pattern | Description | Example Payload |
|---------|-------------|-----------------|
| `get_user` | Fetch user by ID | `{"id": 123}` |
| `calculate_sum` | Sum array of numbers | `{"numbers": [1,2,3,4,5]}` |

### Event Patterns (Fire and Forget)
| Pattern | Description | Example Payload |
|---------|-------------|-----------------|
| `user_created` | User registration event | `{"userId": 456, "email": "test@example.com"}` |
| `notification_sent` | Notification tracking | `{"userId": 789, "type": "email"}` |

---

## 🛠️ Commands Cheat Sheet

```bash
# Start Redis
docker-compose up -d redis

# Stop Redis
docker-compose stop redis

# View Redis logs
docker-compose logs -f redis

# Connect to Redis CLI
docker exec -it nestdocs-redis redis-cli

# Monitor all Redis commands in real-time
docker exec -it nestdocs-redis redis-cli MONITOR

# Check Redis health
docker exec -it nestdocs-redis redis-cli ping
# Should return: PONG

# List all active pub/sub channels
docker exec -it nestdocs-redis redis-cli PUBSUB CHANNELS

# Restart all services
docker-compose restart
```

---

## 🎓 Key Concepts

### What's a Transport?
A transport is the communication method between services:
- **REDIS** - What we're using (fast, simple)
- **TCP** - Direct socket connection
- **NATS** - Cloud-native messaging
- **RabbitMQ** - Advanced message queuing
- **Kafka** - Event streaming

### Why Redis?
- ✅ Fast (in-memory)
- ✅ Simple to set up
- ✅ Great for caching too
- ✅ Pub/Sub built-in
- ✅ Persistent (with appendonly yes)

### Message Pattern vs Event Pattern
| Aspect | Message Pattern | Event Pattern |
|--------|-----------------|---------------|
| Response | ✅ Yes | ❌ No |
| Blocking | ✅ Waits | ❌ Fire & forget |
| Use Case | Data queries | Notifications |
| Example | Get user info | User logged in |

---

## 🚨 Troubleshooting

### Redis Connection Failed
```bash
# Check if Redis is running
docker ps | grep redis

# Check Redis logs
docker-compose logs redis

# Restart Redis
docker-compose restart redis
```

### No Response from Message Pattern
- Check Redis CLI: `PUBSUB CHANNELS`
- Ensure microservice started: Look for "🔴 Redis microservice started"
- Check pattern name matches exactly

### Events Not Firing
- Events don't return responses - check logs instead
- Use Redis MONITOR to see all commands
- Ensure JSON payload is valid

---

## 📚 Next Steps

1. **Create more message patterns** for your business logic
2. **Split into microservices** - separate apps for different domains
3. **Add error handling** with try/catch in handlers
4. **Implement retries** for failed messages
5. **Add caching** using Redis for data storage too

---

Happy microservicing! 🚀
