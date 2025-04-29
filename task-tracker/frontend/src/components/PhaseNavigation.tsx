import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { updateClientAPI } from "../redux/clientSlice";
import Spinner from "./Spinner";
import type { RootState, AppDispatch } from "../redux/store";
interface PhaseNavigationProps {
	setDirection?: (dir: "forward" | "backward") => void;
}

const PhaseNavigation: React.FC<PhaseNavigationProps> = ({ setDirection }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const { id } = useParams();
	const location = useLocation();

	const [isUpdating, setIsUpdating] = useState(false);

	const clients = useSelector((state: RootState) => state.client.clients);
	const client = clients.find((c) => c.id === Number(id));

	const dashboardButton = (
		<button
			type="button"
			onClick={() => navigate("/clients")}
			disabled={isUpdating}
			className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center space-x-2"
		>
			{isUpdating ? <Spinner size="w-4 h-4" /> : "⬅ Back to Dashboard"}
		</button>
	);

	let phaseButton = null;

	if (location.pathname === "/clients/new") {
		return <div className="flex space-x-4 mb-6">{dashboardButton}</div>;
	}

	const handleBack = async (newStatus: string) => {
		if (!client) return;
		setIsUpdating(true);

		try {
			await dispatch(
				updateClientAPI({ id: client.id, updates: { status: newStatus } }),
			).unwrap();
			navigate(`/clients/${client.id}`);
		} catch (error) {
			console.error("Failed to go back phase:", error);
			alert("Something went wrong while navigating back. Please try again.");
		} finally {
			setIsUpdating(false);
		}
	};

	if (client) {
		switch (client.status) {
			case "Proposal":
				phaseButton = (
					<button
						type="button"
						disabled={isUpdating}
						onClick={() => handleBack("Create")}
						className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center space-x-2"
					>
						{isUpdating ? <Spinner size="w-4 h-4" /> : "⬅ Back to Create Phase"}
					</button>
				);
				break;
			case "Pending Decision":
				phaseButton = (
					<button
						type="button"
						disabled={isUpdating}
						onClick={() => handleBack("Proposal")}
						className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center space-x-2"
					>
						{isUpdating ? (
							<Spinner size="w-4 h-4" />
						) : (
							"⬅ Back to Proposal Phase"
						)}
					</button>
				);
				break;
			case "Finalization":
				phaseButton = (
					<button
						type="button"
						disabled={isUpdating}
						onClick={() => handleBack("Pending Decision")}
						className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center space-x-2"
					>
						{isUpdating ? (
							<Spinner size="w-4 h-4" />
						) : (
							"⬅ Back to Decision Phase"
						)}
					</button>
				);
				break;
		}
	}

	return (
		<div className="flex flex-wrap space-x-4 mb-6">
			{phaseButton && phaseButton}
			{dashboardButton}
		</div>
	);
};

export default PhaseNavigation;
