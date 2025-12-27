// lib/online-presence/sockets.ts
import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { registerSocketEvents } from "./socketEvents.ts";
import type { AuthenticatedSocket } from "./verifySocketJWT.ts";


/**
 * Map of online users: userId -> socketId
 */
export const onlineUsers = new Map<number, string>();

let io: Server;

/**
 * Initialize Socket.io
 */
export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // later replace with frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log("🟢 Socket connected:", socket.id);

    // ---- Add user to online map ----
    if (socket.user) {
      const userId = socket.user.id;
      onlineUsers.set(userId, socket.id);
      io.emit("user:online", { userId });
    }

    // ---- Register custom events ----
    registerSocketEvents(socket);

    // ---- Handle disconnect ----
    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);

      if (socket.user) {
        const userId = socket.user.id;
        if (onlineUsers.get(userId) === socket.id) {
          onlineUsers.delete(userId);
          io.emit("user:offline", { userId });
        }
      }
    });
  });

  return io;
};

/**
 * Access Socket.io instance elsewhere in server code
 */
export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
