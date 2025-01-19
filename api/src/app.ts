import "dotenv/config";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

import routes from "./routes";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

// Capturando exceções não tratadas
process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err);
  process.exit(1); // Opcional: sai do processo após uma exceção não tratada
});

// Capturando promessas rejeitadas não tratadas
process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1); // Opcional: sai do processo após uma rejeição não tratada
});
const server = createServer(app);

const { NODE_ENV, SERVER_PORT, FRONT_END_DEV_URL } = process.env;

console.log("FRONT_END_DEV_URL: ", FRONT_END_DEV_URL);
const io = new SocketIOServer(server, {
  cors: {
    origin: FRONT_END_DEV_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = 8080;

app.use(express.json());
app.use(express.text());

app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

app.use("/api", routes(io));

io.on("connection", (socket: Socket) => {
  console.log("Client connected to socket:", socket.id);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode.`);
});
