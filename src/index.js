import React from "react";
import { createRoot } from "react-dom/client";
import VehicleDataDashboard from "./VehicleDataDashboard";
import "./styles.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <VehicleDataDashboard />
  </React.StrictMode>
);
