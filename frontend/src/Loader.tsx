import React from "react";

export const Loader: React.FC<React.HTMLProps<HTMLDivElement>> = ({
	children = "Loading...",
	...props
}) => <div {...props}>{children}</div>;
