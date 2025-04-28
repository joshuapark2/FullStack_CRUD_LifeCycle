import { useDispatch, useSelector } from "react-redux";
import { clearCurrentClient, setCurrentClient } from "../redux/clientSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import { persistor } from "../redux/store";

const ClientDashboard: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// Pull clients array from Redux store
	const clients = useSelector((state: RootState) => state.client.clients);

	const handleFullReset = () => {
		dispatch({ type: "RESET_APP" });
		persistor.purge(); // Clears redux-persist storage
	};

	return (
		<div>
			<h2>Client Onboarding Dashboard</h2>
			<button
				type="button"
				onClick={() => {
					dispatch(clearCurrentClient());
					navigate("/clients/new");
				}}
			>
				Start New Onboarding
			</button>

			<button type="button" onClick={handleFullReset}>
				Reset Application
			</button>

			{clients.length === 0 ? (
				<p>No clients found. Start a new onboarding process!</p>
			) : (
				<table border={1} cellPadding={8} style={{ marginTop: "20px" }}>
					<thead>
						<tr>
							<th>Full Name</th>
							<th>Date Created</th>
							<th>Status</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{clients.map((client) => (
							<tr key={client.id}>
								<td>{client.fullName}</td>
								<td>{client.date}</td>
								<td>{client.status}</td>
								<td>
									<button
										type="button"
										onClick={() => handleNavigateToPhase(client)}
									>
										Continue
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);

	// Helper to navigate based on client status
	function handleNavigateToPhase(
		client: RootState["client"]["clients"][number],
	) {
		if (client.status === "Closed and Onboarded") {
			alert("This client's onboarding is already completed.");
			return;
		}

		dispatch(setCurrentClient(client)); // Set the selected client
		navigate(`/clients/${client.id}`);
	}
};

export default ClientDashboard;
