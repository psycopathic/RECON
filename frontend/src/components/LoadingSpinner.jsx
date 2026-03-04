import React from "react";

const LoadingSpinner = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-slate-900">
			<div className="relative">
				<div className="w-16 h-16 border-2 border-slate-700 rounded-full" />
				<div className="w-16 h-16 border-t-2 border-sky-500 animate-spin rounded-full absolute left-0 top-0" />
				<div className="sr-only">Loading</div>
			</div>
		</div>
	);
};

export default LoadingSpinner;