import "./divider.css";

import React from "react";

export const Divider: React.FC<JSX.IntrinsicElements["div"]> = props => (
	<div className="c-divider" {...props} />
);
