import "./textarea.css";

import React from "react";

export const Textarea: React.FC<JSX.IntrinsicElements["textarea"]> = props => (
	<textarea className="c-textarea" {...props} />
);
