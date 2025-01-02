import { Router } from "express";
import { Server as SocketIOServer } from "socket.io";

const webhookRoutes = (io: SocketIOServer): Router => {
  const router = Router();

  router.post("/", (req, res) => {
    const { alert_name } = req.body;

    io.emit("alert", {
      alertName: alert_name,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({ message: "Webhook processed successfully" });
  });

  return router;
};

export default webhookRoutes;
