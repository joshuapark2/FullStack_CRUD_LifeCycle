import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientDashboard from "./components/ClientDashboard";
import CreatePhase from "./components/CreatePhase";
import LifecycleManager from "./components/LifecycleManager";
import AboutPage from "./components/AboutPage";
import QAPage from "./components/QAPage"; // <-- Import!

import Header from "./components/Header"; // if not already imported!

const App: React.FC = () => {
	return (
		<Router>
			<Header />
			<div className="pt-20">
				{" "}
				{/* Push content down under header */}
				<Routes>
					<Route path="/" element={<ClientDashboard />} />
					<Route path="/clients" element={<ClientDashboard />} />
					<Route path="/clients/:id" element={<LifecycleManager />} />
					<Route path="/clients/new" element={<CreatePhase />} />
					<Route path="/about" element={<AboutPage />} />
					<Route path="/qa" element={<QAPage />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
