import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { updateClientAPI } from "../redux/clientSlice";
import PhaseNavigation from "./PhaseNavigation";
import Spinner from "./Spinner";
import type { RootState, AppDispatch } from "../redux/store";

const membershipTiers = [
	{ tier: "Basic", fee: "$50", features: "Checking, Savings" },
	{ tier: "Premium", fee: "$150", features: "+ Credit Line, Merchant Svc" },
	{ tier: "Enterprise", fee: "$500", features: "+ Dedicated Manager, Perks" },
];

const DecisionPhase: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const client = useSelector((state: RootState) => state.client.currentClient);

	const [selectedTier, setSelectedTier] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [direction, setDirection] = useState<"forward" | "backward">("forward");
	const [error, setError] = useState<string | null>(null); // ✅ New error state

	useEffect(() => {
		if (client?.selectedTier) {
			setSelectedTier(client.selectedTier);
		}
	}, [client]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null); // Reset any previous errors

		if (!client || client.id === undefined) {
			setError("⚠️ Client data is missing. Please restart onboarding.");
			return;
		}

		if (!selectedTier) {
			setError("⚠️ Please select a membership tier before proceeding.");
			return;
		}

		try {
			setIsSubmitting(true);

			await dispatch(
				updateClientAPI({
					id: client.id,
					updates: {
						selectedTier,
						status: "Finalization",
					},
				}),
			).unwrap();

			setTimeout(() => {
				navigate(`/clients/${client.id}`);
			}, 500);
		} catch (error) {
			console.error("Failed to update client during decision phase:", error);
			setError("⚠️ Something went wrong while finalizing the membership.");
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
						key={client.id || "phase"}
						initial={{ opacity: 0, x: direction === "forward" ? 100 : -100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: direction === "forward" ? -100 : 100 }}
						transition={{ duration: 0.5 }}
						className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg"
					>
						<h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
							Decision Phase - Finalize Membership
						</h2>

						<p className="mb-6 text-center">
							<strong>Client:</strong> {client.fullName}
						</p>

						<form onSubmit={handleSubmit} className="flex flex-col space-y-6">
							<div className="flex flex-row gap-6 overflow-x-auto">
								{membershipTiers.map((option) => (
									<label
										key={option.tier}
										htmlFor={option.tier}
										className={`flex flex-col items-center p-6 border-2 rounded-lg transition-all cursor-pointer min-w-[200px] flex-1 ${
											selectedTier === option.tier
												? "border-blue-600 bg-blue-50"
												: "border-gray-300 hover:border-blue-400"
										}`}
									>
										<input
											id={option.tier}
											type="radio"
											name="membershipTier"
											value={option.tier}
											checked={selectedTier === option.tier}
											onChange={(e) => setSelectedTier(e.target.value)}
											className="hidden"
										/>
										<h3 className="text-lg font-bold mb-2">{option.tier}</h3>
										<p className="text-blue-600 font-semibold mb-2">
											{option.fee}
										</p>
										<p className="text-sm text-center">{option.features}</p>
									</label>
								))}
							</div>

							{error && (
								<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
									{error}
								</div>
							)}

							<button
								type="submit"
								className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex justify-center items-center"
							>
								{isSubmitting ? <Spinner /> : "Proceed to Finalization"}
							</button>
						</form>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default DecisionPhase;
