import "./select.css";

import React from "react";

export function Select(props: JSX.IntrinsicElements["select"]) {
	return (
		<div className="c-select-wrapper">
			<select className="c-select" {...props} />
		</div>
	);
}
