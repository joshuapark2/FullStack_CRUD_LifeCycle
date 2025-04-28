import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { updateCurrentClient } from "../redux/clientSlice";
import PhaseNavigation from "./PhaseNavigation";

const ProposalPhase: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const client = useSelector((state: RootState) => state.client.currentClient);

	const [selectedServices, setSelectedServices] = useState<string[]>(
		client?.servicesRequested || [],
	);
	const [sendPreview, setSendPreview] = useState(false);

	const handleServiceChange = (service: string) => {
		setSelectedServices((prev) =>
			prev.includes(service)
				? prev.filter((s) => s !== service)
				: [...prev, service],
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (selectedServices.length === 0) {
			alert("Please select at least one banking service to propose.");
			return;
		}

		dispatch(
			updateCurrentClient({
				servicesProposed: selectedServices,
				sendPreview,
				status: "Pending Decision",
			}),
		);

		// Navigate AFTER ensuring state is updated
		navigate(`/clients/${client?.id}`);
	};

	if (!client)
		return <p>No client data found. Please start onboarding first.</p>;

	return (
		<div>
			<PhaseNavigation />

			<h2>Proposal Phase - Draft Banking Solutions</h2>
			<p>
				<strong>Client:</strong> {client.fullName} ({client.clientType})
			</p>

			<form onSubmit={handleSubmit}>
				<fieldset>
					<legend>Select Banking Services to Propose:</legend>
					{[
						"Checking Account",
						"Savings Account",
						"Credit Line",
						"Merchant Services",
					].map((service) => (
						<label key={service}>
							<input
								type="checkbox"
								value={service}
								checked={selectedServices.includes(service)}
								onChange={() => handleServiceChange(service)}
							/>
							{service}
						</label>
					))}
				</fieldset>

				<label>
					<input
						type="checkbox"
						checked={sendPreview}
						onChange={() => setSendPreview(!sendPreview)}
					/>
					Send Proposal for Client Preview
				</label>

				<button type="submit">Proceed to Decision Phase</button>
			</form>
		</div>
	);
};

export default ProposalPhase;
