import App from "@/App.tsx";
import "@/i18n/config";
import "@/styles/index.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
