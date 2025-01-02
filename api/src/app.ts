import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import routes from "./routes";

const app = express();
const server = createServer(app);

const { NODE_ENV, SERVER_PORT, FRONT_END_DEV_URL } = process.env;
const isDev = NODE_ENV !== "production";

const io = new SocketIOServer(server, {
  cors: isDev
    ? {
        origin: FRONT_END_DEV_URL,
        methods: ["GET", "POST"],
        credentials: true,
      }
    : undefined,
});

const PORT = SERVER_PORT || 3000;

app.use(express.json());

app.use("/api", routes(io));

io.on("connection", (socket) => {
  console.log("Client connected to socket:", socket.id);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode.`);
});