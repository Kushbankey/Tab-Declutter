import React from "react";
import ReactDOM from "react-dom/client";
import App from "./popup/App";
import "./popup/index.css";
import { StyleSheetManager } from "styled-components";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StyleSheetManager>
      <App />
    </StyleSheetManager>
  </React.StrictMode>
);
