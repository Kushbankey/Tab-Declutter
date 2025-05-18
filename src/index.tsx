import React from "react";
import ReactDOM from "react-dom/client";
import App from "./popup/App";
import "./popup/index.css"; // Assuming you'll have a global CSS for the popup

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
