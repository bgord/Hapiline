import React from "react";

export function Close(props: JSX.IntrinsicElements["path"]) {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<title>Close</title>
			<path
				d="M6 18L18 6M6 6L18 18"
				stroke="#4A5568"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-label="close"
				{...props}
			/>
		</svg>
	);
}
