import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ContextProvider } from "./store/ContextApi.jsx";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextProvider>
      <App />
      <Toaster />
    </ContextProvider>
  </StrictMode>
);
