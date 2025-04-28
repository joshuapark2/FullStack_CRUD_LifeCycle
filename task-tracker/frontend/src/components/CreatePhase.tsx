import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createClient, updateCurrentClient } from "../redux/clientSlice";
import type { RootState } from "../redux/store";
import PhaseNavigation from "./PhaseNavigation";

const CreatePhase: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const currentClient = useSelector(
		(state: RootState) => state.client.currentClient,
	);

	const [fullName, setFullName] = useState(currentClient?.fullName || "");
	const [clientType, setClientType] = useState(
		currentClient?.clientType || "Personal",
	);
	const [services, setServices] = useState<string[]>(
		currentClient?.servicesRequested || [],
	);

	useEffect(() => {
		if (currentClient && currentClient.status !== "Create") {
			dispatch(updateCurrentClient({ status: "Create" }));
		}
	}, [currentClient, dispatch]);

	const handleServiceChange = (service: string) => {
		setServices((prev) =>
			prev.includes(service)
				? prev.filter((s) => s !== service)
				: [...prev, service],
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (services.length === 0) {
			alert("Please select at least one requested service.");
			return;
		}

		if (!fullName.includes(" ")) {
			alert("Please enter a full name (first and last).");
			return;
		}

		const newClient = {
			id: currentClient?.id ?? Date.now(),
			fullName,
			clientType,
			servicesRequested: services,
			status: "Proposal",
			date: currentClient?.date ?? new Date().toISOString().split("T")[0],
		};

		if (currentClient) {
			dispatch(updateCurrentClient(newClient));
		} else {
			dispatch(createClient(newClient));
		}

		navigate(`/clients/${newClient.id}`);
	};

	return (
		<div>
			<PhaseNavigation />
			<h2>Create Phase - Client Onboarding</h2>
			<form onSubmit={handleSubmit}>
				<label>
					Full Name:
					<input
						type="text"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						required
					/>
				</label>

				<fieldset>
					<legend>Client Type:</legend>
					<label>
						<input
							type="radio"
							name="clientType"
							value="Personal"
							checked={clientType === "Personal"}
							onChange={(e) => setClientType(e.target.value)}
						/>
						Personal
					</label>
					<label>
						<input
							type="radio"
							name="clientType"
							value="Business"
							checked={clientType === "Business"}
							onChange={(e) => setClientType(e.target.value)}
						/>
						Business
					</label>
				</fieldset>

				<fieldset>
					<legend>Requested Services:</legend>
					{["Checking", "Savings", "Credit Line", "Merchant Services"].map(
						(service) => (
							<label key={service}>
								<input
									type="checkbox"
									value={service}
									checked={services.includes(service)}
									onChange={() => handleServiceChange(service)}
								/>
								{service}
							</label>
						),
					)}
				</fieldset>

				<button type="submit">Proceed to Proposal Phase</button>
			</form>
		</div>
	);
};

export default CreatePhase;
