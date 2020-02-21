import "./select.css";

import React from "react";

export const Select: React.FC<JSX.IntrinsicElements["select"]> = props => (
	<div className="c-select-wrapper">
		<select className="c-select" {...props} />
	</div>
);
