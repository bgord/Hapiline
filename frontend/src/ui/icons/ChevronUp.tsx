import React from "react";

export const ChevronUpIcon: React.FC<JSX.IntrinsicElements["path"]> = props => (
	<svg
		style={{height: "16px"}}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M5 15L12 8L19 15"
			stroke="var(--gray-10)"
			strokeWidth="3"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		/>
	</svg>
);
