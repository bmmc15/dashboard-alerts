import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const { VITE_SOCKET_URL } = import.meta.env;
console.log("Connecting to: ", VITE_SOCKET_URL);
const socket = io(VITE_SOCKET_URL);

const Alerts = () => {
  const [alerts, setAlerts] = useState<
    { alert_name: string; timestamp: string }[]
  >([]);

  useEffect(() => {
    socket.on("alert", (data) => {
      console.log("New ALERT");
      setAlerts((prev) => [...prev, data]);
    });

    return () => {
      socket.off("alert");
    };
  }, []);

  return (
    <div>
      <h1>Alertas 1111</h1>
      {alerts.map((alert, index) => (
        <div key={index}>
          <h2>{alert.alert_name}</h2>
          <p>{new Date(alert.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Alerts;
