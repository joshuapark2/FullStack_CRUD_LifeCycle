import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

import "./index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<Provider store={store}>
				<PersistGate loading={<p>Loading...</p>} persistor={persistor}>
					<App />
				</PersistGate>
			</Provider>
		</React.StrictMode>,
	);
} else {
	console.error("Root element not found!");
}
