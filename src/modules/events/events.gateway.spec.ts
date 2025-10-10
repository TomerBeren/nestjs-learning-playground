import { Test, TestingModule } from '@nestjs/testing';
import { EventsGateway } from './events.gateway';
import { Socket } from 'socket.io';

describe('EventsGateway', () => {
  let gateway: EventsGateway;
  let mockClient: Partial<Socket>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsGateway],
    }).compile();

    gateway = module.get<EventsGateway>(EventsGateway);

    // Mock Socket client
    mockClient = {
      id: 'test-client-123',
      join: jest.fn(),
      leave: jest.fn(),
      emit: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should log when a client connects', () => {
      const logSpy = jest.spyOn(gateway['logger'], 'log');
      
      gateway.handleConnection(mockClient as Socket);

      expect(logSpy).toHaveBeenCalledWith('Client connected: test-client-123');
    });
  });

  describe('handleDisconnect', () => {
    it('should log when a client disconnects', () => {
      const logSpy = jest.spyOn(gateway['logger'], 'log');
      
      gateway.handleDisconnect(mockClient as Socket);

      expect(logSpy).toHaveBeenCalledWith(
        'Client disconnected: test-client-123',
      );
    });
  });

  describe('handleMessage', () => {
    it('should echo the message back', () => {
      const message = 'Hello WebSocket';
      
      const result = gateway.handleMessage(message, mockClient as Socket);

      expect(result).toBe('Echo: Hello WebSocket');
    });

    it('should log the received message', () => {
      const logSpy = jest.spyOn(gateway['logger'], 'log');
      const message = 'Test message';
      
      gateway.handleMessage(message, mockClient as Socket);

      expect(logSpy).toHaveBeenCalledWith(
        `Message received from test-client-123: Test message`,
      );
    });
  });

  describe('handleJoinRoom', () => {
    it('should join the client to a room', () => {
      const room = 'test-room';
      
      gateway.handleJoinRoom(room, mockClient as Socket);

      expect(mockClient.join).toHaveBeenCalledWith(room);
    });

    it('should emit joined-room event to client', () => {
      const room = 'test-room';
      
      gateway.handleJoinRoom(room, mockClient as Socket);

      expect(mockClient.emit).toHaveBeenCalledWith('joined-room', room);
    });

    it('should log when client joins a room', () => {
      const logSpy = jest.spyOn(gateway['logger'], 'log');
      const room = 'test-room';
      
      gateway.handleJoinRoom(room, mockClient as Socket);

      expect(logSpy).toHaveBeenCalledWith(
        'Client test-client-123 joined room: test-room',
      );
    });
  });

  describe('handleLeaveRoom', () => {
    it('should remove the client from a room', () => {
      const room = 'test-room';
      
      gateway.handleLeaveRoom(room, mockClient as Socket);

      expect(mockClient.leave).toHaveBeenCalledWith(room);
    });

    it('should emit left-room event to client', () => {
      const room = 'test-room';
      
      gateway.handleLeaveRoom(room, mockClient as Socket);

      expect(mockClient.emit).toHaveBeenCalledWith('left-room', room);
    });
  });

  describe('handleRoomMessage', () => {
    it('should broadcast message to a room', () => {
      const payload = { room: 'test-room', message: 'Hello room' };
      const mockServer = {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      };
      gateway.server = mockServer as any;

      gateway.handleRoomMessage(payload, mockClient as Socket);

      expect(mockServer.to).toHaveBeenCalledWith('test-room');
      expect(mockServer.emit).toHaveBeenCalledWith('room-message', {
        clientId: 'test-client-123',
        message: 'Hello room',
      });
    });
  });

  describe('broadcastToAll', () => {
    it('should emit event to all connected clients', () => {
      const mockServer = {
        emit: jest.fn(),
      };
      gateway.server = mockServer as any;

      gateway.broadcastToAll('notification', { text: 'Hello everyone' });

      expect(mockServer.emit).toHaveBeenCalledWith('notification', {
        text: 'Hello everyone',
      });
    });
  });

  describe('sendToClient', () => {
    it('should send event to specific client', () => {
      const mockServer = {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      };
      gateway.server = mockServer as any;

      gateway.sendToClient('client-456', 'private-message', { text: 'Hi!' });

      expect(mockServer.to).toHaveBeenCalledWith('client-456');
      expect(mockServer.emit).toHaveBeenCalledWith('private-message', {
        text: 'Hi!',
      });
    });
  });

  describe('handlePing', () => {
    it('should send multiple pong responses', (done) => {
      jest.useFakeTimers();

      gateway.handlePing(mockClient as Socket);

      // First response sent immediately
      expect(mockClient.emit).toHaveBeenCalledWith('pong', {
        count: 1,
        message: 'First response',
      });

      // Fast-forward all timers
      jest.runAllTimers();

      // Should have sent 3 responses total
      expect(mockClient.emit).toHaveBeenCalledTimes(3);
      expect(mockClient.emit).toHaveBeenCalledWith('pong', {
        count: 2,
        message: 'Second response',
      });
      expect(mockClient.emit).toHaveBeenCalledWith('pong', {
        count: 3,
        message: 'Third response',
      });

      jest.useRealTimers();
      done();
    });
  });
});
