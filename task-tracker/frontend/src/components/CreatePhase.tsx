import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	createClientAPI,
	updateClientAPI,
	setCurrentClient,
} from "../redux/clientSlice";
import PhaseNavigation from "./PhaseNavigation";
import type { AppDispatch, RootState } from "../redux/store";

const CreatePhase: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
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
		if (
			currentClient &&
			currentClient.status !== "Create" &&
			currentClient.id !== undefined
		) {
			dispatch(setCurrentClient({ ...currentClient, status: "Create" }));
		}
	}, [currentClient, dispatch]);

	const handleServiceChange = (service: string) => {
		setServices((prev) =>
			prev.includes(service)
				? prev.filter((s) => s !== service)
				: [...prev, service],
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!fullName.includes(" ")) {
			alert("Please enter both first and last name.");
			return;
		}
		if (services.length === 0) {
			alert("Please select at least one requested service.");
			return;
		}

		const payload = {
			fullName,
			clientType,
			servicesRequested: services,
			status: "Proposal",
			date: new Date().toISOString().split("T")[0],
			sendPreview: false,
		};

		try {
			let client;
			if (currentClient?.id) {
				client = await dispatch(
					updateClientAPI({ id: currentClient.id, updates: payload }),
				).unwrap();
			} else {
				client = await dispatch(
					createClientAPI({ ...payload, id: 0 }),
				).unwrap();
			}

			navigate(`/clients/${client.id}`);
		} catch (error) {
			console.error("Failed to proceed to proposal phase:", error);
		}
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
					{["Personal", "Business"].map((type) => (
						<label key={type}>
							<input
								type="radio"
								name="clientType"
								value={type}
								checked={clientType === type}
								onChange={(e) => setClientType(e.target.value)}
							/>
							{type}
						</label>
					))}
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
