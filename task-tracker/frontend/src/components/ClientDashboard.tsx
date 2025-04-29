import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	clearCurrentClient,
	setCurrentClient,
	fetchClients,
} from "../redux/clientSlice";
import { deleteAllClientsAPI } from "../redux/clientSlice";
import { useNavigate } from "react-router-dom";
import { persistor } from "../redux/store";
import type { RootState } from "../redux/store";
import type { AppDispatch } from "../redux/store";

const ClientDashboard: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	const clients = useSelector((state: RootState) => state.client.clients);
	const loading = useSelector((state: RootState) => state.client.loading);
	const error = useSelector((state: RootState) => state.client.error);

	// 🚀 Fetch clients from backend when page loads
	useEffect(() => {
		dispatch(fetchClients());
	}, [dispatch]);

	const handleFullReset = async () => {
		if (
			window.confirm(
				"Are you sure you want to delete all clients and reset the application?",
			)
		) {
			try {
				await dispatch(deleteAllClientsAPI()).unwrap();
				dispatch({ type: "RESET_APP" });
				persistor.purge();
			} catch (error) {
				console.error("Failed to reset application:", error);
				alert("Something went wrong while resetting the app.");
			}
		}
	};

	return (
		<div>
			<h2>Client Onboarding Dashboard</h2>

			<div style={{ marginBottom: "20px" }}>
				<button
					type="button"
					onClick={() => {
						dispatch(clearCurrentClient());
						navigate("/clients/new");
					}}
				>
					Start New Onboarding
				</button>

				<button
					type="button"
					onClick={handleFullReset}
					style={{ marginLeft: "10px" }}
				>
					Reset Application
				</button>
			</div>

			{loading ? (
				<p>Loading clients...</p>
			) : error ? (
				<p style={{ color: "red" }}>Error: {error}</p>
			) : clients.length === 0 ? (
				<p>No clients found. Start a new onboarding process!</p>
			) : (
				<table border={1} cellPadding={8}>
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

	function handleNavigateToPhase(
		client: RootState["client"]["clients"][number],
	) {
		if (client.status === "Closed and Onboarded") {
			alert("This client's onboarding is already completed.");
			return;
		}
		dispatch(setCurrentClient(client));
		navigate(`/clients/${client.id}`);
	}
};

export default ClientDashboard;
