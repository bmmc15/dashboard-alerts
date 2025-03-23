import React, { useEffect, useState, useRef } from "react";
import { AlertData } from "../types/alert";
import { useSocket } from "../context/SocketContext";
import { useSoundSettings } from "../context/SoundContext";

const AlertCard: React.FC<{ alert: AlertData }> = ({ alert }) => {
  const isSell = alert.message.toUpperCase().includes("SELL");
  const formattedTime = new Date(alert.trigger_time || "").toLocaleTimeString();

  return (
    <div
      className={`
        flex items-center space-x-4 p-3 rounded-lg 
        ${
          isSell
            ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
            : "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
        } 
        border animate-signal-pulse
      `}
    >
      <div
        className={`
          flex-shrink-0 w-2 h-2 rounded-full
          ${isSell ? "bg-red-500" : "bg-green-500"}
        `}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {alert.ticker} / {alert.timeframe}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formattedTime}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {alert.indicator}
          </span>
          <span
            className={`text-xs font-semibold ${
              isSell
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {alert.message}
          </span>
          {alert.price && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              @ {alert.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface ConnectionStatusProps {
  isConnected: boolean;
  title: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  title,
}) => (
  <div
    className={`px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between`}
  >
    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {title}
    </h3>
    <div className="flex items-center space-x-2">
      <span
        className={`w-2 h-2 rounded-full ${
          isConnected ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {isConnected ? "Connected" : "Disconnected"}
      </span>
    </div>
  </div>
);

interface AlertLogProps {
  title: string;
  type?: "recent" | "history";
}

const AlertLog: React.FC<AlertLogProps> = ({ title, type = "recent" }) => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { socket, isConnected } = useSocket();
  const { playSound } = useSoundSettings();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleAlert = (data: AlertData) => {
      if (
        (type === "recent" && data.type === "recent") ||
        (type === "history" && data.type === "history")
      ) {
        console.log(`${type} AlertLog received:`, data);
        setAlerts((prevAlerts) => [data, ...prevAlerts].slice(0, 50));
        playSound(data.message.toUpperCase().includes("SELL") ? "sell" : "buy");
      }
    };

    socket.on("alert", handleAlert);
    console.log(`Listening for ${type} alerts in AlertLog`);

    return () => {
      socket.off("alert", handleAlert);
    };
  }, [socket, isConnected, playSound, type]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [alerts]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <ConnectionStatus isConnected={isConnected} title={title} />
      <div
        ref={containerRef}
        className="p-4 h-48 overflow-y-auto space-y-2 alerts-container"
      >
        {alerts.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            {isConnected
              ? "No alerts yet. Waiting for signals..."
              : "Connecting to server..."}
          </div>
        ) : (
          alerts.map((alert, index) => (
            <AlertCard
              key={`${alert.ticker}-${alert.timeframe}-${index}`}
              alert={alert}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AlertLog;
