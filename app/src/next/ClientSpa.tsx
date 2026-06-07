"use client";

import { BrowserRouter } from "react-router-dom";
import App from "@/App";

export default function ClientSpa() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
