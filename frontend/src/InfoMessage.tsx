import React from "react";

export const InfoMessage: React.FC<React.HTMLProps<HTMLDivElement>> = ({
	className = "",
	...props
}) => {
	return <div className={`text-center ${className}`} {...props} />;
};
