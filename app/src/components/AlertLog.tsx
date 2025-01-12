// src/components/AlertLog.tsx
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

interface AlertData {
  ticker: string;
  price: string;
  alert_name: string;
  trigger_time: string;
  timeframe: string;
  indicator: string;
  message: string;
}

const { VITE_SOCKET_URL } = import.meta.env;
console.log("Connecting to: ", VITE_SOCKET_URL);
const socket = io(VITE_SOCKET_URL);

const AlertLog: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("alert", (data: AlertData) => {
      setAlerts((prevAlerts) => [data, ...prevAlerts]);
    });

    return () => {
      socket.off("alert");
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [alerts]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "600px",
        overflowY: "auto",
        padding: "10px",
        backgroundColor: "#f4f4f4",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {alerts.map((alert, index) => (
        <div
          key={index}
          style={{
            backgroundColor: "#fff",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "6px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            borderLeft: "4px solid #4CAF50",
          }}
        >
          <pre style={{ margin: 0, fontFamily: "monospace" }}>
            {JSON.stringify(alert, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
};

export default AlertLog;
