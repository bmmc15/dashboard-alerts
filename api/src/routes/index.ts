import { Router } from "express";
import { Server as SocketIOServer } from "socket.io";
import webhookRoutes from "./webhook";

const routes = (io: SocketIOServer): Router => {
  const router = Router();

  router.use("/webhook", webhookRoutes(io));

  router.get("/", (req, res) => {
    res.send("API is running");
  });

  return router;
};

export default routes;
