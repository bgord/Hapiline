import "../frontend/css/index.css";

import React from "react";

export const Demo: React.FC = ({children}) => (
	<div className="w-screen h-screen flex justify-center p-4">{children}</div>
);
