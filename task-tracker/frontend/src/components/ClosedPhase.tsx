import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { updateClientAPI, clearCurrentClient } from "../redux/clientSlice";
import PhaseNavigation from "./PhaseNavigation";
import Spinner from "./Spinner";
import PhaseBadge from "./PhaseBadge";
import type { RootState, AppDispatch } from "../redux/store";
import { useState } from "react";

const ClosedPhase: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const client = useSelector((state: RootState) => state.client.currentClient);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [direction, setDirection] = useState<"forward" | "backward">("forward");

	const handleComplete = async () => {
		if (!client) {
			alert("No client loaded. Please restart onboarding.");
			return;
		}

		try {
			setIsSubmitting(true);

			await dispatch(
				updateClientAPI({
					id: client.id,
					updates: { status: "Closed and Onboarded" },
				}),
			).unwrap();

			dispatch(clearCurrentClient());
			navigate("/clients", {
				state: { successMessage: "Client onboarding completed successfully!" },
			});
			// 👆 Pass success message via React Router state
		} catch (error) {
			console.error("Failed to finalize onboarding:", error);
			setIsSubmitting(false);
		}
	};

	if (!client) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p>No client data found. Please start onboarding first.</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4">
			<PhaseNavigation setDirection={setDirection} />

			<AnimatePresence mode="wait">
				{!isSubmitting && (
					<motion.div
						key={client.id || "phase"} // 🔥 Correctly key by client
						initial={{ opacity: 0, x: direction === "forward" ? 100 : -100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: direction === "forward" ? -100 : 100 }}
						transition={{ duration: 0.5 }}
						className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg text-center"
					>
						<h2 className="text-2xl md:text-3xl font-bold mb-6">
							Closed Phase - Finalization & Onboarding
						</h2>

						<div className="flex flex-col items-start space-y-4 text-left">
							<p>
								<strong>Client:</strong> {client.fullName}
							</p>
							<p>
								<strong>Selected Services:</strong>{" "}
								{client.servicesProposed?.join(", ")}
							</p>
							<p>
								<strong>Membership Tier:</strong> {client.selectedTier}
							</p>
							<p className="flex items-center space-x-2">
								<strong>Status:</strong>
								<PhaseBadge status={client.status} />
							</p>
						</div>

						<button
							type="button"
							onClick={handleComplete}
							className="mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300 flex justify-center items-center mx-auto"
						>
							{isSubmitting ? <Spinner /> : "Complete Onboarding"}
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ClosedPhase;
