import { Router, Request, Response, RequestHandler } from "express";
import { io } from "../app";
import { AlertService } from "../services/AlertService";

const router = Router();
const alertService = new AlertService();

const handleWebhook: RequestHandler = async (req, res) => {
  try {
    let alert;

    // Check if it's a legacy alert format
    if (req.body.symbol && req.body.timeframe && req.body.indicator) {
      alert = await alertService.processLegacyAlert(req.body);
    }
    // Check if it's a text alert
    else if (typeof req.body === "string" || req.body.text) {
      const alertText = typeof req.body === "string" ? req.body : req.body.text;
      alert = await alertService.processTextAlert(alertText);
    }
    // Unknown format
    else {
      throw new Error("Invalid alert format");
    }

    // Emit the standardized alert to all connected clients
    io.emit("alert", alert);

    res.json({
      success: true,
      alert,
    });
  } catch (error: unknown) {
    console.error("Error processing alert:", error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

router.post("/", handleWebhook);

export default router;
