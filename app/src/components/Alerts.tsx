import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Altere para o endereço do backend

const Alerts = () => {
  const [alerts, setAlerts] = useState<
    { alert_name: string; timestamp: string }[]
  >([]);

  useEffect(() => {
    // Escutar por novos alertas
    socket.on("alert", (data) => {
      console.log("New ALERT");
      setAlerts((prev) => [...prev, data]);
    });

    // Limpar o evento quando o componente desmontar
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
