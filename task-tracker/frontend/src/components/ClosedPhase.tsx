import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { updateCurrentClient, clearCurrentClient } from "../redux/clientSlice";
import PhaseNavigation from "./PhaseNavigation";
const ClosedPhase: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const client = useSelector((state: RootState) => state.client.currentClient);

	const handleComplete = () => {
		dispatch(updateCurrentClient({ status: "Closed and Onboarded" }));
		dispatch(clearCurrentClient()); // Optional: reset current client state
		navigate("/clients");
	};

	if (!client)
		return <p>No client data found. Please start onboarding first.</p>;

	return (
		<div>
			<PhaseNavigation />

			<h2>Closed Phase - Finalization & Onboarding</h2>
			<p>
				<strong>Client:</strong> {client.fullName}
			</p>
			<p>
				<strong>Selected Services:</strong>{" "}
				{client.servicesProposed?.join(", ")}
			</p>
			<p>
				<strong>Membership Tier:</strong> {client.selectedTier}
			</p>
			<p>
				<strong>Status:</strong> {client.status}
			</p>

			<br />
			<button type="button" onClick={handleComplete}>
				Complete Onboarding
			</button>
		</div>
	);
};

export default ClosedPhase;
