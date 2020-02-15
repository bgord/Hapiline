import "./input.css";
import React from "react";

export const Input: React.FC<JSX.IntrinsicElements["input"] & {
	placeholder: JSX.IntrinsicElements["input"]["placeholder"];
}> = props => <input className="c-input" {...props} />;
