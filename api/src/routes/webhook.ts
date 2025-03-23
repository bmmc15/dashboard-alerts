import { Router, Request, Response, RequestHandler } from "express";
import { Server as SocketIOServer } from "socket.io";
import { AlertService } from "../services/AlertService";

const webhookRoutes = (io: SocketIOServer): Router => {
  const router = Router();
  const alertService = new AlertService();

  const handler: RequestHandler = async (req, res) => {
    try {
      console.log("Received Alert:", req.body);

      // Check if it's a legacy alert format
      if (
        req.body.symbol &&
        req.body.timeframe &&
        typeof req.body.indicator === "number"
      ) {
        const legacyAlert = {
          action: req.body.action,
          symbol: req.body.symbol,
          timeframe: req.body.timeframe.toString(),
          indicator: req.body.indicator,
        };

        // Process and save the alert
        const savedAlert = await alertService.processLegacyAlert(legacyAlert);
        console.log("Saved alert:", savedAlert);

        // Emit the alert to connected clients
        io.emit("alert", {
          type: "legacy-alert",
          content: savedAlert,
          timestamp: savedAlert.received_at.toISOString(),
        });

        res.status(200).json({
          message: "Legacy alert processed successfully",
          alert: savedAlert,
        });
        return;
      }

      // Handle other alert formats as before
      let payload;
      if (req.is("text/*")) {
        console.log("TEXT Headers:", req.headers);
        console.log("TEXT Body:", req.body);
        payload = {
          type: "text-alert",
          content: req.body,
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
    } catch (error: unknown) {
      console.error("Error processing webhook:", error);
      res.status(500).json({
        message: "Error processing webhook",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  router.post("/", handler);

  return router;
};

export default webhookRoutes;
