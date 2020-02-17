import "./header.css";

import React from "react";

export const Header: React.FC<JSX.IntrinsicElements["header"]> = props => (
	<header className="c-header" {...props} />
);
