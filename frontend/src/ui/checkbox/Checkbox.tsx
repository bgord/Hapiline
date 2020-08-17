import "./checkbox.css";

import React from "react";

export function Checkbox(props: JSX.IntrinsicElements["input"]) {
	return <input type="checkbox" className="c-checkbox" {...props} />;
}
