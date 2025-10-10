import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(80, { 
  namespace: 'events',
  cors: {
    origin: '*', // Configure this properly in production
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  /**
   * Called once the gateway is initialized
   */
  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  /**
   * Called when a client connects
   */
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  /**
   * Called when a client disconnects
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Listen for 'message' events from clients
   */
  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    this.logger.log(`Message received from ${client.id}: ${data}`);
    return `Echo: ${data}`;
  }

  /**
   * Listen for 'join-room' events
   */
  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
    client.emit('joined-room', room);
  }

  /**
   * Listen for 'leave-room' events
   */
  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
    client.emit('left-room', room);
  }

  /**
   * Broadcast a message to a specific room
   */
  @SubscribeMessage('room-message')
  handleRoomMessage(
    @MessageBody() payload: { room: string; message: string },
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.log(
      `Broadcasting to room ${payload.room}: ${payload.message}`,
    );
    this.server.to(payload.room).emit('room-message', {
      clientId: client.id,
      message: payload.message,
    });
  }

  /**
   * Send multiple responses by emitting directly to the client
   * Client will receive 3 separate messages
   */
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket): void {
    this.logger.log(`Ping received from ${client.id}`);
    
    // Send multiple responses
    client.emit('pong', { count: 1, message: 'First response' });
    
    setTimeout(() => {
      client.emit('pong', { count: 2, message: 'Second response' });
    }, 1000);
    
    setTimeout(() => {
      client.emit('pong', { count: 3, message: 'Third response' });
    }, 2000);
  }

  /**
   * Broadcast to all connected clients
   */
  broadcastToAll(event: string, data: any): void {
    this.server.emit(event, data);
  }

  /**
   * Send message to specific client
   */
  sendToClient(clientId: string, event: string, data: any): void {
    this.server.to(clientId).emit(event, data);
  }
}
