import React from "react";

export const Logo: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
	className = "",
	...props
}) => (
	<img
		alt="Hapiline logo"
		src="logo.png"
		className={`h-10 ${className}`}
		{...props}
	/>
);
