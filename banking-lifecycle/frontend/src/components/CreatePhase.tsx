import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
	createClientAPI,
	updateClientAPI,
	setCurrentClient,
} from "../redux/clientSlice";
import type { Client } from "../redux/clientSlice";
import PhaseNavigation from "./PhaseNavigation";
import Spinner from "./Spinner";
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
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [direction, setDirection] = useState<"forward" | "backward">("forward");

	const [error, setError] = useState<string | null>(null); // ✅ NEW

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

		setError(null); // Reset previous errors

		if (!fullName.trim().includes(" ")) {
			setError("⚠️ Please enter both a first and last name.");
			return;
		}

		if (services.length === 0) {
			setError("⚠️ Please select at least one requested service.");
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
			setIsSubmitting(true);

			let client: Client;
			if (currentClient?.id) {
				client = await dispatch(
					updateClientAPI({ id: currentClient.id, updates: payload }),
				).unwrap();
			} else {
				client = await dispatch(
					createClientAPI({ ...payload, id: 0 }),
				).unwrap();
			}

			setTimeout(() => {
				navigate(`/clients/${client.id}`);
			}, 500);
		} catch (error) {
			console.error("Failed to proceed to proposal phase:", error);
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4">
			<PhaseNavigation setDirection={setDirection} />

			<AnimatePresence mode="wait">
				{!isSubmitting && (
					<motion.div
						key={currentClient?.id || "phase"}
						initial={{ opacity: 0, x: direction === "forward" ? 100 : -100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: direction === "forward" ? -100 : 100 }}
						transition={{ duration: 0.5 }}
						className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg"
					>
						<h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
							Create Phase - Client Onboarding
						</h2>

						<form onSubmit={handleSubmit} className="flex flex-col space-y-6">
							<div className="flex flex-col">
								<label
									htmlFor="fullName"
									className="text-sm md:text-base font-medium mb-2"
								>
									Full Name
								</label>
								<input
									id="fullName"
									type="text"
									className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
									required
								/>
							</div>

							<fieldset className="flex flex-col">
								<legend className="text-sm md:text-base font-medium mb-2">
									Client Type
								</legend>
								<div className="flex flex-wrap gap-4">
									{["Personal", "Business"].map((type) => (
										<label key={type} className="flex items-center space-x-2">
											<input
												type="radio"
												name="clientType"
												value={type}
												checked={clientType === type}
												onChange={(e) => setClientType(e.target.value)}
												className="accent-blue-500"
											/>
											<span>{type}</span>
										</label>
									))}
								</div>
							</fieldset>

							<fieldset className="flex flex-col">
								<legend className="text-sm md:text-base font-medium mb-2">
									Requested Services
								</legend>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{[
										"Checking",
										"Savings",
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
												checked={services.includes(service)}
												onChange={() => handleServiceChange(service)}
												className="accent-blue-500"
											/>
											<span>{service}</span>
										</label>
									))}
								</div>
							</fieldset>

							{error && (
								<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
									{error}
								</div>
							)}

							<button
								type="submit"
								className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex justify-center items-center"
							>
								{isSubmitting ? <Spinner /> : "Proceed to Proposal Phase"}
							</button>
						</form>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default CreatePhase;
