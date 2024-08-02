import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import Flow from "./components/Flow";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Flow />
  </StrictMode>
);
