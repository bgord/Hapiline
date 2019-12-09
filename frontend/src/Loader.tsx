import React from "react";

export const Loader: React.FC<JSX.IntrinsicElements["div"]> = ({
	children = "Loading...",
	...props
}) => <div {...props}>{children}</div>;
