import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import routes from "./routes";

const app = express();

const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/healthcheck", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/webhook", (req, res) => {
  console.log(
    `New alert received at, ${new Date().toISOString()}:\n`,
    req.body
  );
  const { ticker, price, alert_name, trigger_time } = req.body;
  io.emit("new_alert", { ticker, price, alert_name, trigger_time });

  res.status(200).json({ message: "Webhook received successfully" });
});
io.on("connection", (socket) => {
  console.log("Client connected to socket:", socket.id);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
