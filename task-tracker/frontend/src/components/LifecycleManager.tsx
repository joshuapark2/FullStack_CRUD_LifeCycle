import { useSelector } from "react-redux";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";

import CreatePhase from "./CreatePhase";
import ProposalPhase from "./ProposalPhase";
import DecisionPhase from "./DecisionPhase";
import ClosedPhase from "./ClosedPhase";

const LifecycleManager: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const clients = useSelector((state: RootState) => state.client.clients);

	const client = clients.find((c) => c.id === Number(id));

	if (!client) {
		return <Navigate to="/clients" replace />;
	}

	switch (client.status) {
		case "Create":
			return <CreatePhase />;
		case "Proposal":
			return <ProposalPhase />;
		case "Pending Decision":
			return <DecisionPhase />;
		case "Finalization":
			return <ClosedPhase />;
		case "Closed and Onboarded":
			return (
				<div>
					<h2>{client.fullName}'s Onboarding is Complete ✅</h2>
					<p>Status: {client.status}</p>
					<button type="button" onClick={() => navigate("/clients")}>
						Back to Dashboard
					</button>
				</div>
			);
		default:
			return <CreatePhase />;
	}
};

export default LifecycleManager;
