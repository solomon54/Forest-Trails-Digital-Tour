// lib/online-presence/socketAuth.ts
import { Server, Socket } from "socket.io";
import { verifySocketJWT } from "./verifySocketJWT.ts";
import { AuthenticatedSocket } from "./verifySocketJWT.ts";

/**
 * Apply JWT authentication to all incoming Socket.io connections.
 * Attaches userId to the socket if token is valid.
 */
export const applySocketAuth = (io: Server) => {
  io.use((socket: Socket, next) => {
    try {
      verifySocketJWT(socket as AuthenticatedSocket, next);
    } catch (err) {
      console.error("[SOCKET_AUTH_ERROR]", err);
      next(new Error("Unauthorized"));
    }
  });
};
