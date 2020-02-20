import "./checkbox.css";

import React from "react";

export const Checkbox: React.FC<JSX.IntrinsicElements["input"]> = props => (
	<input type="checkbox" className="c-checkbox" {...props} />
);
