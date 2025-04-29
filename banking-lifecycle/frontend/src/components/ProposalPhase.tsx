import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { updateClientAPI } from "../redux/clientSlice";
import PhaseNavigation from "./PhaseNavigation";
import Spinner from "./Spinner";
import type { RootState, AppDispatch } from "../redux/store";

const ProposalPhase: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	const client = useSelector((state: RootState) => state.client.currentClient);

	const [selectedServices, setSelectedServices] = useState<string[]>([]);
	const [sendPreview, setSendPreview] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [direction, setDirection] = useState<"forward" | "backward">("forward");
	const [error, setError] = useState<string | null>(null); // ✅ New error state

	useEffect(() => {
		if (client?.servicesProposed?.length) {
			setSelectedServices(client.servicesProposed);
		} else if (client?.servicesRequested?.length) {
			setSelectedServices(client.servicesRequested);
		}

		if (client?.sendPreview) {
			setSendPreview(client.sendPreview);
		}
	}, [client]);

	const handleServiceChange = (service: string) => {
		setSelectedServices((prev) =>
			prev.includes(service)
				? prev.filter((s) => s !== service)
				: [...prev, service],
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null); // Reset previous errors

		if (!client || client.id === undefined) {
			setError("⚠️ Client data is missing. Please restart onboarding.");
			return;
		}

		// Validate: at least one of the 4 official banking services selected
		const validProposalServices = [
			"Checking Account",
			"Savings Account",
			"Credit Line",
			"Merchant Services",
		];

		const hasValidServiceSelected = selectedServices.some((service) =>
			validProposalServices.includes(service),
		);

		if (!hasValidServiceSelected) {
			setError(
				"⚠️ Please select at least one valid banking service to propose (Checking Account, Savings Account, Credit Line, Merchant Services).",
			);
			return;
		}

		try {
			setIsSubmitting(true);

			await dispatch(
				updateClientAPI({
					id: client.id,
					updates: {
						servicesProposed: selectedServices,
						sendPreview,
						status: "Pending Decision",
					},
				}),
			).unwrap();

			setTimeout(() => {
				navigate(`/clients/${client.id}`);
			}, 500);
		} catch (error) {
			console.error("Failed to update client during proposal phase:", error);
			setError("⚠️ Something went wrong while updating client.");
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
						className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg"
					>
						<h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
							Proposal Phase - Draft Banking Solutions
						</h2>

						<p className="mb-6 text-center">
							<strong>Client:</strong> {client.fullName} ({client.clientType})
						</p>

						<form onSubmit={handleSubmit} className="flex flex-col space-y-6">
							<fieldset className="flex flex-col">
								<legend className="text-sm md:text-base font-medium mb-2">
									Select Banking Services to Propose
								</legend>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{[
										"Checking Account",
										"Savings Account",
										"Credit Line",
										"Merchant Services",
									].map((service) => (
										<label
											key={service}
											className="flex items-center space-x-2"
										>
											<input
												type="checkbox"
												value={service}
												checked={selectedServices.includes(service)}
												onChange={() => handleServiceChange(service)}
												className="accent-blue-500"
											/>
											<span>{service}</span>
										</label>
									))}
								</div>
							</fieldset>

							<div className="flex items-center space-x-2">
								<input
									id="sendPreview"
									type="checkbox"
									checked={sendPreview}
									onChange={() => setSendPreview(!sendPreview)}
									className="accent-blue-500"
								/>
								<label
									htmlFor="sendPreview"
									className="text-sm md:text-base font-medium"
								>
									Send Proposal for Client Preview
								</label>
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
								{isSubmitting ? <Spinner /> : "Proceed to Decision Phase"}
							</button>
						</form>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ProposalPhase;
