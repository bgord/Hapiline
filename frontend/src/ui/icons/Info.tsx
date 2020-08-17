import React from "react";

export function InfoIcon(props: JSX.IntrinsicElements["path"]) {
	return (
		<svg
			style={{maxWidth: "24px"}}
			data-width="100%"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Info</title>
			<path
				d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
				stroke="#4A5568"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-label="info"
				{...props}
			/>
		</svg>
	);
}
