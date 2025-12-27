//digital-tour/server.ts
import http from "http";
import next from "next";
import { initSocket } from "./lib/online-presence/sockets.ts";
import { applySocketAuth } from "./lib/online-presence/socketAuth.ts";


const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const server = http.createServer((req, res) => handle(req, res));

  // init socket
  const io = initSocket(server);

  // apply JWT auth middleware
  applySocketAuth(io);

  server.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
  });
});
