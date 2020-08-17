import React from "react";

export function ChevronDownIcon(props: JSX.IntrinsicElements["path"]) {
	return (
		<svg
			style={{height: "16px"}}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Chevron down</title>
			<path
				d="M19 9L12 16L5 9"
				stroke="var(--gray-10)"
				strokeWidth="3"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-label="chevron down"
				{...props}
			/>
		</svg>
	);
}
