const Spinner: React.FC<{ size?: string }> = ({ size = "w-5 h-5" }) => {
	return (
		<div
			className={`${size} border-2 border-white border-t-transparent border-solid rounded-full animate-spin`}
			role="status"
			aria-label="Loading"
		/>
	);
};

export default Spinner;
