import React from "react";

export function Loader(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			data-on-entry="rotate"
			width="50"
			height="50"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<defs>
				<mask id="slice">
					<rect width="100%" height="100%" fill="white" />
					<rect height="50%" width="50%" fill="black" />
				</mask>
			</defs>
			<circle
				className="c-loader"
				cx="25"
				cy="25"
				r="20"
				stroke-width="4"
				stroke="var(--brand-blue)"
				fill="none"
				mask="url(#slice)"
			/>
		</svg>
	);
}
