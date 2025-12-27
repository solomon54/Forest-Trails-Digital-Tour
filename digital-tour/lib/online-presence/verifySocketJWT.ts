// lib/verifySocketJWT.ts
import jwt from "jsonwebtoken";
import type { Socket } from "socket.io";

interface JWTPayload {
  id: number;
  email: string;
  role: "user" | "admin";
  iat?: number;
  exp?: number;
}

export interface AuthenticatedSocket extends Socket {
  user?: JWTPayload;
}

export function verifySocketJWT(socket: AuthenticatedSocket, next: (err?: Error) => void) {
  try {
    // Token can come from auth or headers
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JWTPayload;

    // Attach user to socket
    socket.user = decoded;

    next();
  } catch (error) {
    return next(new Error("Invalid or expired token"));
  }
}
