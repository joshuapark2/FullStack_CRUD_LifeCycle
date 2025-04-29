import { motion } from "framer-motion";

interface PhaseBadgeProps {
	status: string;
}

const phaseColors: Record<string, string> = {
	Create: "bg-gray-400",
	Proposal: "bg-blue-500",
	"Pending Decision": "bg-yellow-500",
	Finalization: "bg-purple-500",
	"Closed and Onboarded": "bg-green-500",
};

const PhaseBadge: React.FC<PhaseBadgeProps> = ({ status }) => {
	const color = phaseColors[status] || "bg-gray-300";

	return (
		<motion.span
			key={status} // important! triggers animation on status change
			initial={{ scale: 0.8, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
			className={`inline-flex items-center px-3 py-1 rounded-full text-white text-xs font-semibold ${color}`}
		>
			{status}
		</motion.span>
	);
};

export default PhaseBadge;
