import { Router, Request, Response } from "express";
import { Server as SocketIOServer } from "socket.io";

const webhookRoutes = (io: SocketIOServer): Router => {
  const router = Router();

  router.post("/", (req: Request, res: Response) => {
    console.log("Received Alert:", req.body);

    const alert: { message?: string } = {};
    let payload;

    if (req.is("text/*")) {
      console.log("TEXT Headers:", req.headers);
      console.log("TEXT Body:", req.body);
      console.log("Text Alert received:", req.body);
      alert.message = req.body;

      payload = {
        type: "text-alert",
        content: alert.message,
        timestamp: new Date().toISOString(),
      };
    } else {
      console.log("JSON Headers:", req.headers);
      console.log("JSON Body:", req.body);
      payload = {
        type: "json-alert",
        content: req.body,
        timestamp: new Date().toISOString(),
      };
    }

    io.emit("alert", payload);

    res.status(200).json({ message: "Webhook processed successfully" });
  });

  return router;
};

export default webhookRoutes;
