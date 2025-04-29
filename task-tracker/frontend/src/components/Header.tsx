import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/pegaCompanyLogo.png";

const Header: React.FC = () => {
	const location = useLocation();

	const navItems = [
		{ name: "Dashboard", path: "/clients" },
		{ name: "About Company", path: "/about" },
		{ name: "Q&A", path: "/qa" },
	];

	return (
		<header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
			<div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
				{/* Company Icon and Name */}
				<Link
					to="/clients"
					className="flex items-center space-x-3 hover:opacity-80 transition"
				>
					<img src={logo} alt="Company Logo" className="w-10 h-10" />
					<span className="font-bold text-xl text-gray-800">
						TaskTracker Co.
					</span>
				</Link>

				{/* Navigation Links */}
				<nav className="flex items-center space-x-6">
					{navItems.map((item) => (
						<Link
							key={item.name}
							to={item.path}
							className={`text-gray-600 hover:text-blue-600 font-medium transition ${
								location.pathname.startsWith(item.path) ? "text-blue-600" : ""
							}`}
						>
							{item.name}
						</Link>
					))}
				</nav>
			</div>
		</header>
	);
};

export default Header;
