import React from "react";

export const RequestErrorMessage: React.FC = ({children}) => (
	<div className="w-full text-center text-red-700 mt-4">{children}</div>
);

export const ValidationErrorMessage: React.FC = ({children}) => (
	<div className="w-full text-red-700 mt-1">{children}</div>
);
