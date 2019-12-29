import React from "react";

export const InfoMessage: React.FC<JSX.IntrinsicElements["div"]> = ({className = "", ...props}) => {
	return <div className={`text-center ${className}`} {...props} />;
};
