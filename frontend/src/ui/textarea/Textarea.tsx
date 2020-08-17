import "./textarea.css";

import React from "react";

export function Textarea(props: JSX.IntrinsicElements["textarea"]) {
	return <textarea className="c-textarea" {...props} />;
}
