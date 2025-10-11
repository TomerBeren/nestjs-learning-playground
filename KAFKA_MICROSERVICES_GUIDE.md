# Kafka Microservices Testing Guide

## Overview
This guide shows how to test Kafka microservices in the NestDocs hybrid application.

## Kafka Topics & Patterns

### Message Patterns (Request/Response)
- `orders.create` - Create new order and get confirmation
- `payments.process` - Process payment and get transaction details

### Event Patterns (Fire and Forget)
- `orders.status-updated` - Order status change notifications
- `users.activity` - User activity tracking
- `notifications.email` - Email notifications

## Testing with Docker

### 1. Start All Services
```powershell
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Zookeeper (port 2181)
- Kafka (port 9092)
- NestJS App (port 3000)

### 2. Check Kafka is Running
```powershell
# Check Kafka container logs
docker logs nestdocs-kafka

# List Kafka topics
docker exec nestdocs-kafka kafka-topics --bootstrap-server localhost:9092 --list
```

### 3. Send Test Messages via Kafka Console Producer

#### Create Order (Message Pattern)
```powershell
docker exec -it nestdocs-kafka kafka-console-producer --bootstrap-server localhost:9092 --topic orders.create --property "parse.key=true" --property "key.separator=:"
```
Then type:
```
key1:{"product": "Laptop", "quantity": 2, "price": 1200}
```

#### Order Status Update (Event Pattern)
```powershell
docker exec -it nestdocs-kafka kafka-console-producer --bootstrap-server localhost:9092 --topic orders.status-updated
```
Then type:
```json
{"orderId": "ORD-123", "status": "shipped", "trackingNumber": "TRACK-456"}
```

#### Process Payment (Message Pattern)
```powershell
docker exec -it nestdocs-kafka kafka-console-producer --bootstrap-server localhost:9092 --topic payments.process
```
Then type:
```json
{"amount": 150.00, "currency": "USD", "cardLast4": "4242"}
```

#### User Activity (Event Pattern)
```powershell
docker exec -it nestdocs-kafka kafka-console-producer --bootstrap-server localhost:9092 --topic users.activity
```
Then type:
```json
{"userId": "user-123", "action": "page_view", "page": "/products", "timestamp": "2024-01-15T10:30:00Z"}
```

#### Email Notification (Event Pattern)
```powershell
docker exec -it nestdocs-kafka kafka-console-producer --bootstrap-server localhost:9092 --topic notifications.email
```
Then type:
```json
{"to": "user@example.com", "subject": "Order Confirmation", "body": "Your order has been confirmed!"}
```

### 4. Monitor Kafka Messages via Console Consumer

#### Listen to all topics
```powershell
# Orders topic
docker exec -it nestdocs-kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic orders.create --from-beginning

# Status updates
docker exec -it nestdocs-kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic orders.status-updated --from-beginning

# Payments
docker exec -it nestdocs-kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic payments.process --from-beginning
```

### 5. Check Application Logs
```powershell
# Watch NestJS app logs to see Kafka messages being processed
docker logs -f nestdocs-app
```

You should see logs like:
```
📦 Kafka Message - Topic: orders.create, Partition: 0, Offset: 1
📦 Order data: {"product":"Laptop","quantity":2,"price":1200}
💳 Processing payment: {"amount":150,"currency":"USD"}
👤 User activity tracked (offset: 5): {"userId":"user-123","action":"page_view"}
```

## Testing Locally (Without Docker)

### 1. Start Kafka Locally
If you have Kafka installed locally:
```powershell
# Start Zookeeper
zookeeper-server-start.bat config\zookeeper.properties

# Start Kafka (in another terminal)
kafka-server-start.bat config\server.properties
```

### 2. Use kafka-console-producer
```powershell
kafka-console-producer.bat --bootstrap-server localhost:9092 --topic orders.create
```

### 3. Use kafka-console-consumer
```powershell
kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic orders.create --from-beginning
```

## Programmatic Testing with NestJS Client

You can also send Kafka messages from within your NestJS application:

```typescript
import { ClientKafka, Transport } from '@nestjs/microservices';

// In your service or controller
constructor(
  @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka
) {}

async onModuleInit() {
  await this.kafkaClient.connect();
}

// Send message pattern (request/response)
async createOrder(orderData: any) {
  const result = await this.kafkaClient.send('orders.create', orderData).toPromise();
  console.log('Order created:', result);
  return result;
}

// Emit event pattern (fire and forget)
async updateOrderStatus(statusData: any) {
  this.kafkaClient.emit('orders.status-updated', statusData);
}
```

## Kafka Consumer Groups

The app uses consumer group `nestdocs-consumer` configured in `main.ts`. Multiple instances of the app would share message processing.

## Troubleshooting

### Kafka not connecting
```powershell
# Check Kafka health
docker exec nestdocs-kafka kafka-broker-api-versions --bootstrap-server localhost:9092

# Check Zookeeper
docker exec nestdocs-zookeeper zkServer.sh status
```

### Topics not created
```powershell
# Create topic manually
docker exec nestdocs-kafka kafka-topics --bootstrap-server localhost:9092 --create --topic orders.create --partitions 1 --replication-factor 1
```

### View consumer groups
```powershell
docker exec nestdocs-kafka kafka-consumer-groups --bootstrap-server localhost:9092 --list
docker exec nestdocs-kafka kafka-consumer-groups --bootstrap-server localhost:9092 --describe --group nestdocs-consumer
```

## Architecture Overview

Your hybrid app now supports:
- ✅ **HTTP REST API** (port 3000)
- ✅ **GraphQL** (port 3000/graphql)
- ✅ **WebSocket** (Socket.IO on port 3000, namespace /events)
- ✅ **Redis Microservices** (localhost:6379 or redis:6379 in Docker)
- ✅ **Kafka Microservices** (localhost:9092 or kafka:29092 in Docker)

All running in a single NestJS process! 🚀
