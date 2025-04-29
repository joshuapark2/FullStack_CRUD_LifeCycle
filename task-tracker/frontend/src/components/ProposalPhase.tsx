import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateClientAPI } from "../redux/clientSlice";
import type { RootState, AppDispatch } from "../redux/store";
import PhaseNavigation from "./PhaseNavigation";

const ProposalPhase: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	const client = useSelector((state: RootState) => state.client.currentClient);

	const [selectedServices, setSelectedServices] = useState<string[]>([]);
	const [sendPreview, setSendPreview] = useState(false);

	// 🧠 On mount: hydrate local state from Redux (only once)
	useEffect(() => {
		if (client?.servicesProposed?.length) {
			setSelectedServices(client.servicesProposed);
		} else if (client?.servicesRequested?.length) {
			setSelectedServices(client.servicesRequested);
		}

		if (client?.sendPreview) {
			setSendPreview(client.sendPreview);
		}
	}, [client]);

	const handleServiceChange = (service: string) => {
		setSelectedServices((prev) =>
			prev.includes(service)
				? prev.filter((s) => s !== service)
				: [...prev, service],
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!client || client.id === undefined) {
			alert("Client data is missing. Please restart the onboarding.");
			return;
		}

		if (!selectedServices.length) {
			alert("Please select at least one banking service to propose.");
			return;
		}

		try {
			await dispatch(
				updateClientAPI({
					id: client.id,
					updates: {
						servicesProposed: selectedServices,
						sendPreview,
						status: "Pending Decision",
					},
				}),
			).unwrap();

			navigate(`/clients/${client.id}`);
		} catch (error) {
			console.error("Failed to update client during proposal phase:", error);
			alert("Something went wrong while updating client.");
		}
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
