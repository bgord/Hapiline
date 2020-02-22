import "./row.css";

import React from "react";

export const Row: React.FC<JSX.IntrinsicElements["div"]> = props => (
	<div className="c-row" {...props} />
);
