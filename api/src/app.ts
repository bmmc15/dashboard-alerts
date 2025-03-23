import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from './config/env';

interface AlertData {
  ticker: string;
  timeframe: string;
  indicator: string;
  message: string;
  price: string;
  trigger_time?: string;
  alert_name: string;
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.FRONT_END_DEV_URL,
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: config.FRONT_END_DEV_URL
}));
app.use(express.json());

// Keep track of connected clients
let connectedClients = 0;

// Socket.io connection handler
io.on('connection', (socket) => {
  connectedClients++;
  console.log(`Client connected. Total connected clients: ${connectedClients}`);

  // Listen for test alerts from the frontend
  socket.on('test-alert', (data: AlertData) => {
    console.log('Received test alert from frontend:', data);
    io.emit('alert', data);
  });

  socket.on('disconnect', () => {
    connectedClients--;
    console.log(`Client disconnected. Total connected clients: ${connectedClients}`);
  });
});

// Webhook endpoint for TradingView alerts
app.post('/webhook', (req, res) => {
  const alert = req.body;
  console.log('Received webhook alert:', alert);
  
  try {
    // Validate required fields
    if (!alert.ticker || !alert.timeframe || !alert.indicator || !alert.message) {
      throw new Error('Missing required fields');
    }

    // Transform the alert to match expected format
    const transformedAlert: AlertData = {
      ticker: alert.ticker,
      timeframe: alert.timeframe,
      indicator: alert.indicator,
      message: alert.message.toUpperCase(),
      price: alert.price || '0',
      trigger_time: alert.trigger_time || new Date().toISOString(),
      alert_name: alert.alert_name || 'Manual Alert'
    };

    console.log('Broadcasting alert to', connectedClients, 'clients:', transformedAlert);
    
    // Broadcast to all connected clients
    io.emit('alert', transformedAlert);
    
    res.status(200).json({ 
      message: 'Alert received and broadcast',
      alert: transformedAlert,
      connectedClients
    });
  } catch (err) {
    const error = err as Error;
    console.error('Error processing alert:', error.message);
    res.status(500).json({ 
      message: 'Error processing alert',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Accepting connections from: ${config.FRONT_END_DEV_URL}`);
});

export { io };
