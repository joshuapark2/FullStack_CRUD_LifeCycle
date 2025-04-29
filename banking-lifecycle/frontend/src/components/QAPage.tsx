import { useState } from "react";

const faqItems = [
	{
		id: "faq-1",
		question: "How does the client onboarding process work?",
		answer:
			"We guide financial institutions through a structured multi-phase lifecycle to onboard clients securely and efficiently",
	},
	{
		id: "faq-2",
		question: "Can I customize the client journey?",
		answer:
			"Yes! TaskTracker allows full customization of each phase to match your specific institutional needs.",
	},
	{
		id: "faq-3",
		question: "Is TaskTracker secure?",
		answer:
			"Absolutely. We prioritize data security and compliance at every stage of the onboarding lifecycle.",
	},
];

const QAPage: React.FC = () => {
	const [openId, setOpenId] = useState<string | null>(null);

	const toggleAccordion = (id: string) => {
		setOpenId((prevId) => (prevId === id ? null : id));
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4">
			<div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
				<h1 className="text-3xl font-bold mb-8 text-center">
					Q&A - Frequently Asked Questions
				</h1>

				<div className="space-y-4">
					{faqItems.map((item) => (
						<div key={item.id} className="border rounded-lg overflow-hidden">
							{/* Question always fixed */}
							<button
								type="button"
								onClick={() => toggleAccordion(item.id)}
								className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-semibold text-gray-800 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
							>
								<span>{item.question}</span>
								<span>{openId === item.id ? "▲" : "▼"}</span>
							</button>

							{/* Answer collapses below */}
							<div
								className={`transition-all duration-300 overflow-hidden ${
									openId === item.id ? "max-h-96" : "max-h-0"
								}`}
							>
								<div className="px-6 py-4 text-gray-600 text-center">
									<p>{item.answer}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default QAPage;
