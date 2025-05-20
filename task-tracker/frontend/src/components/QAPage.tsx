import { useState } from "react";

const faqItems = [
	{
		id: "faq-1",
		question: "Why did you build this app for Govini?",
		answer:
			"My goal is to turn business ideas into real, usable products—minimizing risk, building trust, and showcasing solutions that reflect both technical expertise and meaningful impact. This app was a way to demonstrate that vision in action for Pegasystems.",
	},
	{
		id: "faq-2",
		question: "What business problem did this application solve?",
		answer:
			"One of the biggest challenges in enterprise software is guiding complex business processes through an end-to-end lifecycle of Create → Proposal → Decision → Closed. This app solves that by streamlining how interfaces are authored and maintained, making case management easier and more intuitive.",
	},
	{
		id: "faq-3",
		question: "What technologies were used to build the application?",
		answer:
			"The frontend was built using JavaScript/TypeScript with React and Redux. The backend was developed using Java and Kotlin, powered by the Spring Boot framework.",
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
