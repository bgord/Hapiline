import React from "react";

export const SuccessMessage: React.FC<JSX.IntrinsicElements["div"]> = ({
	className = "",
	...props
}) => (
	<div className={`success-message w-auto flex justify-between mt-4 ${className}`} {...props} />
);
