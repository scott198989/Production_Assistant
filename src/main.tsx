import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CalculatorProvider } from "./contexts/CalculatorContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <CalculatorProvider>
          <App />
        </CalculatorProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
