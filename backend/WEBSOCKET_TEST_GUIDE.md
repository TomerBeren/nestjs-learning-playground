# 🔌 WebSocket Test Instructions

## ✅ Server is Running!

Your NestJS server is now running with the WebSocket gateway active!

## 📝 How to Test the `onEvent` Function Live:

### Step 1: Open the Test Client
1. Open the file `websocket-test.html` in your browser
2. You can simply **double-click** the file, or open it in any browser

### Step 2: Connect to the WebSocket
1. Click the **"Connect"** button
2. You should see "✅ Connected" status

### Step 3: Test the `onEvent` Function
Click the **"Send 'events' - Get [1, 2, 3]"** button

**What will happen:**
```
📤 Sending 'events': Expecting 3 responses...
📨 EVENT 'events': 1
📨 EVENT 'events': 2
📨 EVENT 'events': 3
```

You'll see **3 separate responses** because your `onEvent` function uses RxJS Observable to emit each value from the array `[1, 2, 3]`!

### How it Works:
```typescript
@SubscribeMessage("events")
onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
  const event = "events";
  const response = [1, 2, 3];

  // from() converts the array to an Observable
  // map() wraps each value in a WsResponse format
  return from(response).pipe(map((data) => ({ event, data })));
}
```

**Flow:**
1. Client sends: `socket.emit('events', { test: 'data' })`
2. Server receives the event
3. `from([1, 2, 3])` creates an Observable that emits: 1, then 2, then 3
4. Each value is wrapped as `{ event: 'events', data: <value> }`
5. Client receives 3 separate messages!

## 🎮 Other Tests You Can Try:

### Simple Echo:
- Type a message and click "Send Message"
- Server echoes it back

### Ping (Timed Responses):
- Click "Send 'ping'"
- Get 3 pongs at: 0s, 1s, 2s

### Rooms:
- Join a room
- Send messages to that room
- Open another browser tab to see room broadcasts!

## 🛠️ Troubleshooting:

If it doesn't connect:
- Make sure the server is running (`npm run start:dev`)
- Check port 80 is not blocked
- Look for WebSocket logs in the terminal

## 📊 Expected Terminal Output:

When you test, you should see:
```
[Nest] LOG [EventsGateway] Client connected: <socket-id>
[Nest] LOG [EventsGateway] Message received from <socket-id>: ...
```

---

**Have fun testing! 🚀**
