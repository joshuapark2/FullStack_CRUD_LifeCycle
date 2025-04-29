import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	clearCurrentClient,
	setCurrentClient,
	fetchClients,
	deleteAllClientsAPI,
} from "../redux/clientSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { persistor } from "../redux/store";
import type { RootState, AppDispatch } from "../redux/store";

const ClientDashboard: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const location = useLocation();
	const successMessage = location.state?.successMessage || null;

	const clients = useSelector((state: RootState) => state.client.clients);
	const loading = useSelector((state: RootState) => state.client.loading);
	const error = useSelector((state: RootState) => state.client.error);

	useEffect(() => {
		dispatch(fetchClients());
	}, [dispatch]);

	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => {
				window.history.replaceState({}, document.title);
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [successMessage]);

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
		<div className="max-w-6xl mx-auto p-6">
			<div className="bg-white rounded-xl shadow-lg p-8">
				{successMessage && (
					<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center animate-fadeIn">
						🎉 {successMessage}
					</div>
				)}

				<h2 className="text-3xl font-bold mb-6 text-center">
					Client Onboarding Dashboard
				</h2>

				<div className="flex justify-center gap-4 mb-8">
					<button
						type="button"
						onClick={() => {
							dispatch(clearCurrentClient());
							navigate("/clients/new");
						}}
						className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-md"
					>
						Start New Onboarding
					</button>

					<button
						type="button"
						onClick={handleFullReset}
						className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md shadow-md"
					>
						Reset Application
					</button>
				</div>

				{loading ? (
					<p className="text-center text-gray-500">Loading clients...</p>
				) : error ? (
					<p className="text-center text-red-600">Error: {error}</p>
				) : clients.length === 0 ? (
					<p className="text-center text-gray-500">
						No clients found. Start a new onboarding process!
					</p>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full border border-gray-300 shadow-sm rounded-md overflow-hidden">
							<thead className="bg-gray-100">
								<tr>
									<th className="py-3 px-6 border-b text-left">Full Name</th>
									<th className="py-3 px-6 border-b text-left">Date Created</th>
									<th className="py-3 px-6 border-b text-left">Status</th>
									<th className="py-3 px-6 border-b text-left">Action</th>
								</tr>
							</thead>
							<tbody>
								{clients
									.slice() // Create a shallow copy to avoid mutating original Redux state
									.sort((a, b) => {
										// Bring non-Onboarded clients first
										if (
											a.status === "Closed and Onboarded" &&
											b.status !== "Closed and Onboarded"
										)
											return 1;
										if (
											a.status !== "Closed and Onboarded" &&
											b.status === "Closed and Onboarded"
										)
											return -1;
										return 0; // Otherwise, maintain current order
									})
									.map((client) => (
										<tr
											key={client.id}
											className="bg-white hover:bg-gray-50 transition duration-150"
										>
											<td className="py-3 px-6 border-b">{client.fullName}</td>
											<td className="py-3 px-6 border-b">{client.date}</td>
											<td className="py-3 px-6 border-b">{client.status}</td>
											<td className="py-3 px-6 border-b">
												{client.status === "Closed and Onboarded" ? (
													<span className="inline-flex items-center justify-center bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-md">
														Onboarded
													</span>
												) : (
													<button
														type="button"
														onClick={() => handleNavigateToPhase(client)}
														className="inline-flex items-center justify-center appearance-none border-0 bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-semibold px-4 py-2 rounded-md transition"
													>
														Continue
													</button>
												)}
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				)}
			</div>
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
