import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Alerts from "./components/Alerts.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <App /> */}
    <Alerts />
  </StrictMode>
);
