import "./column.css";

import React from "react";

export const Column: React.FC<JSX.IntrinsicElements["div"]> = props => (
	<div className="c-column" {...props} />
);
