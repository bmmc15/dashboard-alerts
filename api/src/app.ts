import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import routes from "./routes";

const app = express();
const server = createServer(app);

const { NODE_ENV, SERVER_PORT, FRONT_END_DEV_URL } = process.env;


console.log("FRONT_END_DEV_URL: ", FRONT_END_DEV_URL)
const io = new SocketIOServer(server, {
  cors: {
    origin: FRONT_END_DEV_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = SERVER_PORT || 80;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

app.use("/api", routes(io));

io.on("connection", (socket) => {
  console.log("Client connected to socket:", socket.id);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode.`);
});
