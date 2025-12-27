//lib/online-presence/socketEvents.ts
import { AuthenticatedSocket } from "./verifySocketJWT.ts";
import { onlineUsers } from "./sockets.ts";

export const registerSocketEvents = (socket: AuthenticatedSocket) => {
  if (!socket.user) return;

  const userId = socket.user.id;

  // mark user online
  onlineUsers.set(userId, socket.id);
  socket.broadcast.emit("user:online", { userId });

  /**
   * Example ping/pong event
   */
  socket.on("ping", () => {
    socket.emit("pong");
  });

  /**
   * You can add more events here
   * e.g., notifications, chat messages, admin actions
   */
};
