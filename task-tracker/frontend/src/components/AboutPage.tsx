import companyImage from "../../assets/pegaCompanyLogo.png";
import constellationIntro from "../../assets/pegaConstIntro.png";
import constellationInfinity from "../../assets/pegaConstInfinity.jpg";
import intro from "../../assets/govini_Intro.jpg";
import sustainment from "../../assets/sustainment.png";

const AboutPage: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
			<div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden p-8 flex flex-col space-y-12">
				{/* Section 1: Image Left, Text Right */}
				<div className="flex flex-col md:flex-row gap-6">
					{/* Image */}
					<div className="md:w-1/2">
						<img
							src={intro}
							alt="TaskTracker Company Building"
							className="w-full h-full object-cover rounded-lg"
						/>
					</div>
					{/* Text */}
					<div className="flex flex-col justify-center md:w-1/2">
						<h1 className="text-3xl font-bold mb-4 text-center md:text-left">
							About Govini
						</h1>
						<p className="text-lg text-gray-700 text-center md:text-left">
							Govini was founded to solve one of the Department of Defense’s
							most urgent challenges: modernizing acquisition in the face of
							complex supply chains and strategic competition. Their flagship
							platform, Ark, is a suite of AI-enabled applications powered by
							integrated commercial and government data. Ark replaces outdated,
							manual processes—like spreadsheets and data calls—with guided
							workflows that help acquisition teams make faster, data-driven
							decisions. With IL5 security authorization from DISA and Navy
							sponsorship, Ark is the only Defense Acquisition platform cleared
							for handling sensitive mission-critical data at scale.
						</p>
					</div>
				</div>

				{/* Section 2: Pega Constellation Overview - Split into Two Cards */}
				<div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col gap-12 p-8">
					{/* Card 1: What Is Constellation */}
					<div className="flex flex-col md:flex-row gap-6">
						{/* Text */}
						<div className="flex flex-col justify-center md:w-1/2">
							<h2 className="text-3xl font-bold mb-4 text-center md:text-left">
								ARK Outcomes
							</h2>
							<p className="text-lg text-gray-700 text-center md:text-left">
								A key Department of Defense office faced mounting pressure from
								workforce shortages and a shrinking industrial base—factors
								threatening the success of nuclear modernization programs. Using
								Ark’s Modernization Application, the team built a Risk
								Management Framework tailored to the Nuclear Enterprise. Ark
								enabled forward-looking workforce forecasting and industrial
								capacity analysis, identifying regional contractor needs and
								supply chain vulnerabilities. These insights improved schedule
								and cost feasibility, while equipping leadership to quickly
								pivot to alternative suppliers—reinforcing the reliability of
								the U.S. nuclear deterrent.
							</p>
						</div>

						{/* Image */}
						<div className="md:w-1/2">
							<img
								src={sustainment}
								alt="Pega Constellation UI Architecture"
								className="w-full h-full object-cover rounded-lg"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutPage;
