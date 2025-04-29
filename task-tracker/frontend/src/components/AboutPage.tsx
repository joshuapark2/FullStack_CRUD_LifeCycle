import companyImage from "../../assets/pegaCompanyLogo.png"; // adjust path if needed

const AboutPage: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4">
			<div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
				{/* Image Section */}
				<div className="md:w-1/2">
					<img
						src={companyImage}
						alt="TaskTracker Company Building"
						className="w-full h-full object-cover"
					/>
				</div>

				{/* Text Section */}
				<div className="flex flex-col justify-center p-8 md:w-1/2">
					<h1 className="text-3xl font-bold mb-4 text-center md:text-left">
						About TaskTracker Co.
					</h1>
					<p className="text-lg text-gray-700 text-center md:text-left">
						We help financial institutions onboard clients smoothly and securely
						through a structured lifecycle platform. Our mission is to simplify
						client engagement, increase operational transparency, and accelerate
						digital transformation for banking services.
					</p>
				</div>
			</div>
		</div>
	);
};

export default AboutPage;
