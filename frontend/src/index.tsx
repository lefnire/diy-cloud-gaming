import React from "react";
import { createRoot } from "react-dom/client";
import Index from "components/Index";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { initSentry } from "./lib/errors";
import {setup as initAws} from "./lib/aws/setup";
import CssBaseline from "@mui/material/CssBaseline";

const container = document.getElementById("root");
const root = createRoot(container!);

initAws()
initSentry()

root.render(
  <React.StrictMode>
    <Router>
      <CssBaseline />
      <Index />
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
