import React from "react";
import ReactDOM from "react-dom/client";
import "../enableDevHmr";
import App from "./App";
import "./globals.css";

// Initialize toast container at the root of your app (in App.js or index.js)

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
