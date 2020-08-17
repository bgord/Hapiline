import "./radio.css";

import React from "react";

export function Radio({type, ...props}: JSX.IntrinsicElements["input"]) {
	return <input className="c-radio" type="radio" {...props} />;
}
