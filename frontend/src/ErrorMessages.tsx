import React from "react";

export const ErrorMessage: React.FC<JSX.IntrinsicElements["div"]> = ({
	className = "",
	...props
}) => <div className={`w-full text-red-700 mt-1 ${className}`} {...props} />;

export const RequestErrorMessage: React.FC = ({children}) => (
	<ErrorMessage className="text-center mt-4">{children}</ErrorMessage>
);
