import "./radio.css";

import React from "react";

export const Radio: React.FC<JSX.IntrinsicElements["input"]> = ({type, ...props}) => (
	<input className="c-radio" type="radio" {...props} />
);
