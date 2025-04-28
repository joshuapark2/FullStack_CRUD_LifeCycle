import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientDashboard from "./components/ClientDashboard";
import CreatePhase from "./components/CreatePhase";
import LifecycleManager from "./components/LifecycleManager";

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/clients/:id" element={<LifecycleManager />} />
				<Route path="/clients" element={<ClientDashboard />} />
				<Route path="/clients/new" element={<CreatePhase />} />
			</Routes>
		</Router>
	);
};

export default App;
