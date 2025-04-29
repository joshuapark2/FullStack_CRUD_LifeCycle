import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateClientAPI, clearCurrentClient } from "../redux/clientSlice";
import type { RootState } from "../redux/store";
import PhaseNavigation from "./PhaseNavigation";
import type { AppDispatch } from "../redux/store";

const ClosedPhase: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	const client = useSelector((state: RootState) => state.client.currentClient);

	const handleComplete = async () => {
		if (!client) {
			alert("No client loaded. Please restart onboarding.");
			return;
		}

		try {
			await dispatch(
				updateClientAPI({
					id: client.id,
					updates: {
						status: "Closed and Onboarded",
					},
				}),
			).unwrap();

			alert("Onboarding completed successfully!");
			dispatch(clearCurrentClient());
			navigate("/clients");
		} catch (error) {
			console.error("Failed to finalize onboarding:", error);
		}
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
