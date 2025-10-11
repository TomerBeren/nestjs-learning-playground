# Kafka Self-Communication Testing Guide

## Overview

This guide demonstrates **self-communication** - where your NestJS application sends Kafka messages to itself. This is useful for:

- ✅ Testing your Kafka setup works correctly
- ✅ Asynchronous processing within a monolithic app
- ✅ Decoupling request handling from business logic
- ✅ Future migration to microservices architecture

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Your NestDocs Application                  │
│                                                         │
│  ┌─────────────┐              ┌──────────────────┐    │
│  │   HTTP API  │              │  Kafka Consumer  │    │
│  │             │              │  (Server Side)   │    │
│  │  POST /test │              │                  │    │
│  └──────┬──────┘              └────────▲─────────┘    │
│         │                              │              │
│         │ calls                receives│              │
│         ▼                              │              │
│  ┌─────────────┐    sends message     │              │
│  │   Kafka     ├──────────────────────┘              │
│  │  Producer   │       via Kafka                      │
│  │ (Client)    │                                      │
│  └─────────────┘                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Kafka Broker
                          ▼
                    (localhost:9092)
```

## Two Communication Patterns

### 1. Request/Response Pattern
- **Use Case**: When you need a reply from the message processor
- **Methods**: `sendMessage()` from KafkaProducerService
- **Example Topics**: `orders.create`, `payments.process`
- **Behavior**: Waits for response, returns data to HTTP caller

### 2. Fire and Forget Pattern
- **Use Case**: When you just want to trigger an async action
- **Methods**: `emitEvent()` from KafkaProducerService
- **Example Topics**: `orders.status-updated`, `users.activity`, `notifications.email`
- **Behavior**: Sends message and immediately returns, no waiting

## Available Test Endpoints

### 1. Create Order (Request/Response)
**Endpoint**: `POST http://localhost:3000/api/v1/kafka-test/order`

**Request Body**:
```json
{
  "product": "MacBook Pro",
  "quantity": 1,
  "price": 2499.99
}
```

**Response**:
```json
{
  "success": true,
  "message": "Order sent to Kafka and processed",
  "request": { "product": "MacBook Pro", "quantity": 1, "price": 2499.99 },
  "response": {
    "orderId": "ORD-1234567890",
    "status": "confirmed",
    "total": 2499.99,
    "estimatedDelivery": "2024-01-15"
  }
}
```

**Kafka Topic**: `orders.create`

---

### 2. Process Payment (Request/Response)
**Endpoint**: `POST http://localhost:3000/api/v1/kafka-test/payment`

**Request Body**:
```json
{
  "amount": 150.00,
  "currency": "USD",
  "cardLast4": "4242"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment sent to Kafka and processed",
  "request": { "amount": 150.00, "currency": "USD", "cardLast4": "4242" },
  "response": {
    "transactionId": "TXN-1234567890",
    "status": "approved",
    "amount": 150.00,
    "currency": "USD"
  }
}
```

**Kafka Topic**: `payments.process`

---

### 3. Update Order Status (Fire and Forget)
**Endpoint**: `POST http://localhost:3000/api/v1/kafka-test/order-status`

**Request Body**:
```json
{
  "orderId": "ORD-123",
  "status": "shipped",
  "trackingNumber": "TRACK-456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Order status event emitted to Kafka (fire and forget)",
  "event": {
    "orderId": "ORD-123",
    "status": "shipped",
    "trackingNumber": "TRACK-456"
  }
}
```

**Kafka Topic**: `orders.status-updated`

---

### 4. Track User Activity (Fire and Forget)
**Endpoint**: `POST http://localhost:3000/api/v1/kafka-test/user-activity`

**Request Body**:
```json
{
  "userId": "user-123",
  "action": "page_view",
  "page": "/products"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User activity event emitted to Kafka",
  "event": {
    "userId": "user-123",
    "action": "page_view",
    "page": "/products",
    "timestamp": "2024-01-10T12:00:00.000Z"
  }
}
```

**Kafka Topic**: `users.activity`

---

### 5. Send Email Notification (Fire and Forget)
**Endpoint**: `POST http://localhost:3000/api/v1/kafka-test/email`

**Request Body**:
```json
{
  "to": "user@example.com",
  "subject": "Test Email",
  "body": "This is a test email!"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email notification event emitted to Kafka",
  "event": {
    "to": "user@example.com",
    "subject": "Test Email",
    "body": "This is a test email!"
  }
}
```

**Kafka Topic**: `notifications.email`

---

## Testing Methods

### Method 1: PowerShell Script (Easiest)
```powershell
# Run the automated test script
.\test-kafka.ps1
```

This will test all 5 endpoints sequentially and display results.

### Method 2: Manual Testing with curl
```bash
# 1. Create an order
curl -X POST http://localhost:3000/api/v1/kafka-test/order \
  -H "Content-Type: application/json" \
  -d '{"product":"Laptop","quantity":2,"price":1200}'

# 2. Process a payment
curl -X POST http://localhost:3000/api/v1/kafka-test/payment \
  -H "Content-Type: application/json" \
  -d '{"amount":150.00,"currency":"USD","cardLast4":"4242"}'

# 3. Update order status
curl -X POST http://localhost:3000/api/v1/kafka-test/order-status \
  -H "Content-Type: application/json" \
  -d '{"orderId":"ORD-123","status":"shipped"}'

# 4. Track user activity
curl -X POST http://localhost:3000/api/v1/kafka-test/user-activity \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-123","action":"purchase"}'

# 5. Send email
curl -X POST http://localhost:3000/api/v1/kafka-test/email \
  -H "Content-Type: application/json" \
  -d '{"to":"user@example.com","subject":"Test"}'
```

### Method 3: Postman/Insomnia
Import the endpoints into Postman:
- Base URL: `http://localhost:3000/api/v1`
- All endpoints use POST method
- Set Content-Type header to `application/json`
- Use the example request bodies above

### Method 4: VS Code REST Client
Create a `.http` file:
```http
### Get endpoint info
GET http://localhost:3000/api/v1/kafka-test

### Create order
POST http://localhost:3000/api/v1/kafka-test/order
Content-Type: application/json

{
  "product": "MacBook Pro",
  "quantity": 1,
  "price": 2499.99
}

### Process payment
POST http://localhost:3000/api/v1/kafka-test/payment
Content-Type: application/json

{
  "amount": 150.00,
  "currency": "USD",
  "cardLast4": "4242"
}
```

## Understanding the Logs

When you send a request, you'll see this flow in your terminal:

```
1. HTTP Request:
   🛒 HTTP Request: Creating order via Kafka

2. Kafka Producer:
   📤 Sending message to topic: orders.create
   { product: 'MacBook Pro', quantity: 1, price: 2499.99 }

3. Kafka Consumer:
   📥 Kafka Message Received: orders.create
   Processing order: { product: 'MacBook Pro', quantity: 1, price: 2499.99 }

4. Response:
   ✅ Message sent successfully to: orders.create
```

This shows the complete cycle:
- HTTP → Producer → Kafka Broker → Consumer → Response → HTTP

## Prerequisites

Before testing, ensure:

1. ✅ Docker containers are running:
   ```powershell
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. ✅ NestJS app is running:
   ```powershell
   npm run start:dev
   ```

3. ✅ Check Kafka is connected:
   - Look for "Kafka microservice is listening" in logs
   - No Kafka connection errors in terminal

4. ✅ Check service health:
   ```powershell
   # All should return successfully
   Invoke-RestMethod http://localhost:3000/api/v1/kafka-test
   ```

## Troubleshooting

### Issue: "KAFKA_CLIENT connection error"
**Solution**: 
- Ensure Kafka container is running: `docker ps`
- Check Kafka broker is accessible: `localhost:9092`
- Restart containers: `docker-compose -f docker-compose.dev.yml restart kafka`

### Issue: "Timeout waiting for response"
**Solution**:
- Check both Kafka client AND server are connected
- Look for "Kafka microservice is listening" in logs
- Verify consumer group is consuming: Check Kafka logs

### Issue: "No response from Kafka consumer"
**Solution**:
- Ensure EventsKafkaController has @MessagePattern decorators
- Check topic names match exactly (case-sensitive)
- Verify Kafka consumer group is running

### Issue: Fire and Forget events not processing
**Solution**:
- Check logs for Kafka consumer receiving events
- These don't return responses, so check consumer logs only
- Verify @EventPattern decorators are present

## Next Steps

1. **Monitor Kafka Topics**:
   ```bash
   # List all topics
   docker exec -it kafka kafka-topics --bootstrap-server localhost:9092 --list

   # Watch messages on a topic
   docker exec -it kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic orders.create --from-beginning
   ```

2. **Add More Handlers**:
   - Create new @MessagePattern in EventsKafkaController
   - Add new convenience methods in KafkaProducerService
   - Create HTTP endpoints in KafkaTestController

3. **Scale to Real Microservices**:
   - Split EventsKafkaController into separate services
   - Deploy each service independently
   - Keep same Kafka topic structure

4. **Add Error Handling**:
   - Implement retry logic in producer
   - Add dead letter queues for failed messages
   - Monitor failed message processing

## Code Structure

```
src/modules/events/
├── events.module.ts              # Registers Kafka client & server
├── kafka-producer.service.ts     # Sends messages to Kafka
├── events-kafka.controller.ts    # Receives messages from Kafka
└── kafka-test.controller.ts      # HTTP endpoints for testing
```

## Key Differences: Server vs Client

| Aspect | Server (Consumer) | Client (Producer) |
|--------|------------------|-------------------|
| Setup | `connectMicroservice()` in `main.ts` | `ClientsModule.register()` in module |
| Purpose | **Receives** Kafka messages | **Sends** Kafka messages |
| Decorators | `@MessagePattern`, `@EventPattern` | None needed |
| Methods | Message handlers | `send()`, `emit()` |
| Class | EventsKafkaController | KafkaProducerService |

## Summary

You now have:
- ✅ HTTP endpoints to trigger Kafka messages
- ✅ Kafka producer (client) to send messages
- ✅ Kafka consumer (server) to receive messages
- ✅ Both request/response and fire-and-forget patterns
- ✅ Complete self-communication testing setup

This demonstrates your app can communicate with itself via Kafka, which is perfect for:
- Testing Kafka integration
- Async job processing
- Event-driven architecture within a monolith
- Future microservices migration

**Run the test script and watch the magic happen!** 🚀
