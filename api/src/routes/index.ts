import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/webhook", (req, res) => {
  console.log(
    `New alert received at, ${new Date().toISOString()}:\n`,
    req.body
  );
  const { ticker, price, alert_name, trigger_time } = req.body;

  res.status(200).json({ message: "Webhook received successfully" });
});

export default router;
