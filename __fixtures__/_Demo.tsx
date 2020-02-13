import "../frontend/css/index.css";

import React from "react";

export const Demo: React.FC = ({children}) => (
	<div
		style={{
			paddingTop: "24px",
			paddingLeft: "24px",
		}}
		className="flex items-start w-screen h-screen"
	>
		{children}
	</div>
);
