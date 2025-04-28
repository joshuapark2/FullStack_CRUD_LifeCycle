import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { updateCurrentClient } from "../redux/clientSlice";
import PhaseNavigation from "./PhaseNavigation";
const DecisionPhase: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const client = useSelector((state: RootState) => state.client.currentClient);
	const [selectedTier, setSelectedTier] = useState(client?.selectedTier || "");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedTier) {
			alert("Please select a membership tier before proceeding.");
			return;
		}

		dispatch(
			updateCurrentClient({
				selectedTier,
				status: "Finalization",
			}),
		);

		navigate(`/clients/${client?.id}`);
	};

	if (!client)
		return <p>No client data found. Please start onboarding first.</p>;

	return (
		<div>
			<PhaseNavigation />

			<h2>Decision Phase - Finalize Membership</h2>
			<p>
				<strong>Client:</strong> {client.fullName}
			</p>

			<form onSubmit={handleSubmit}>
				<table border={1} cellPadding={8}>
					<thead>
						<tr>
							<th>Select</th>
							<th>Tier</th>
							<th>Monthly Fee</th>
							<th>Features</th>
						</tr>
					</thead>
					<tbody>
						{[
							{ tier: "Basic", fee: "$50", features: "Checking, Savings" },
							{
								tier: "Premium",
								fee: "$150",
								features: "+ Credit Line, Merchant Svc",
							},
							{
								tier: "Enterprise",
								fee: "$500",
								features: "+ Dedicated Manager, Perks",
							},
						].map((option) => (
							<tr key={option.tier}>
								<td>
									<input
										type="radio"
										name="membershipTier"
										value={option.tier}
										checked={selectedTier === option.tier}
										onChange={(e) => setSelectedTier(e.target.value)}
									/>
								</td>
								<td>{option.tier}</td>
								<td>{option.fee}</td>
								<td>{option.features}</td>
							</tr>
						))}
					</tbody>
				</table>

				<br />
				<button type="submit">Proceed to Finalization</button>
			</form>
		</div>
	);
};

export default DecisionPhase;
