import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import type { RootState } from "../redux/store";
import { updateCurrentClient } from "../redux/clientSlice";

const PhaseNavigation: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id } = useParams();
	const location = useLocation();

	const clients = useSelector((state: RootState) => state.client.clients);
	const client = clients.find((c) => c.id === Number(id));

	// Always show Back to Dashboard button
	const dashboardButton = (
		<button type="button" onClick={() => navigate("/clients")}>
			⬅ Back to Dashboard
		</button>
	);

	let phaseButton = null;

	// If we're in the Create Phase (by URL)
	if (location.pathname === "/clients/new") {
		return <div style={{ marginBottom: "20px" }}>{dashboardButton}</div>;
	}

	if (client) {
		switch (client.status) {
			case "Proposal":
				phaseButton = (
					<button
						type="button"
						onClick={() => {
							dispatch(updateCurrentClient({ status: "Create" }));
							navigate(`/clients/${client.id}`);
						}}
					>
						⬅ Back to Create Phase
					</button>
				);
				break;

			case "Pending Decision":
				phaseButton = (
					<button
						type="button"
						onClick={() => {
							dispatch(updateCurrentClient({ status: "Proposal" }));
							navigate(`/clients/${client.id}`);
						}}
					>
						⬅ Back to Proposal Phase
					</button>
				);
				break;

			case "Finalization":
				phaseButton = (
					<button
						type="button"
						onClick={() => {
							dispatch(updateCurrentClient({ status: "Pending Decision" }));
							navigate(`/clients/${client.id}`);
						}}
					>
						⬅ Back to Decision Phase
					</button>
				);
				break;
		}
	}

	return (
		<div style={{ marginBottom: "20px" }}>
			{phaseButton && (
				<span style={{ marginRight: "10px" }}>{phaseButton}</span>
			)}
			{dashboardButton}
		</div>
	);
};

export default PhaseNavigation;
