// import { Server as HTTPServer } from "http";
// import { Server as IOServer, Socket } from "socket.io";

// let io: IOServer | null = null;

// export const initSocket = (server: HTTPServer) => {
//   if (io) {
//     console.log("⚠️ Socket already initialized");
//     return io;
//   }

//   io = new IOServer(server, {
//     cors: {
//       origin: process.env.CLIENT_URL || "http://localhost:3000",
//       methods: ["GET", "POST"],
//       credentials: true,
//     },
//   });

//   io.on("connect", (socket: Socket) => {
//     console.log("🔌 Client connected:", socket.id);

//     socket.on("join-room", (roomId: string) => {
//       socket.join(roomId);
//       console.log(`📦 Joined room: ${roomId}`);
//     });

//     socket.on("disconnect", () => {
//       console.log("❌ Client disconnected:", socket.id);
//     });
//   });
//   return io;
// };

// export const getIO = () => {
//   if (!io) {
//     throw new Error("Socket io is not intialized");
//   }
//   return io;
// };
import { Server as HTTPServer } from 'http';

import { Server as SocketIOServer } from 'socket.io';



class WebSocketService {

    private io: SocketIOServer | null = null;
  private connectedClients = new Map<string, string>(); // clientId -> userId
initialize(server: HTTPServer | SocketIOServer) {
    if (server instanceof SocketIOServer) {
      this.io = server;
    } else {
      this.io = new SocketIOServer(server, {
        cors: {
          origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          methods: ['GET', 'POST'],
          credentials: true,
        },
        path: '/api/socket',
      });
    }

    this.setupEventHandlers();
    console.log('WebSocket server initialized');
  }

  private setupEventHandlers() {
    if (!this.io) {
      console.warn('!this.io: WebSocket server not initialized ----------------');
      return false;
    }

    this.io.on('connection', socket => {
      console.log(`Client connected: ${socket.id}`);

      // Handle disconnect
      socket.on('disconnect', async () => {
        console.warn(`Client disconnected: ${socket.id}`);

        const userId = this.connectedClients.get(socket.id);
        if (userId) {
          this.connectedClients.delete(socket.id);

          // Logic to decrement spectator count for matches the user was in
          // This is complex as a single user can be in multiple match rooms
          // For simplicity, we might only decrement if they were the *last* spectator from this client.
          // A more robust solution would track active rooms per user.
        }
      });

      socket.on('error', error => {
        console.error('WebSocket error on client:', error);
      });
    });
  }
 getConnectedClientsCount(): number {
    if (!this.io) return 0;
    const room = this.io.sockets.adapter.rooms.get(`match-}`);
    return room ? room.size : 0;
  }

}

export const websocketService = new WebSocketService();
export default websocketService;