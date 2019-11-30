import React from "react";

export const ErrorMessage: React.FC<React.HTMLProps<HTMLDivElement>> = ({
	children,
	className = "",
	...props
}) => (
	<div className={`w-full text-red-700 mt-1 ${className}`} {...props}>
		{children}
	</div>
);

export const RequestErrorMessage: React.FC = ({children}) => (
	<ErrorMessage className="text-center mt-4">{children}</ErrorMessage>
);
