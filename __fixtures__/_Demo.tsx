import React from "react";

export const Demo: React.FC = ({children}) => (
	<div
		style={{
			display: "flex",
			alignItems: "start",
			width: "100vh",
			height: "100vh",
			paddingTop: "24px",
			paddingLeft: "24px",
		}}
	>
		{children}
	</div>
);
