import "./input.css";
import React from "react";

export const Input = React.forwardRef<
	HTMLInputElement,
	JSX.IntrinsicElements["input"] & {
		placeholder: JSX.IntrinsicElements["input"]["placeholder"];
	}
>((props, ref) => <input className="c-input" ref={ref} {...props} />);
