import "../frontend/css/main.css";
import React from "react";
import * as UI from "../frontend/src/ui/row/Row";

export const Demo: React.FC = ({children}) => (
	<UI.Row pt="24" pl="24" crossAxis="start" style={{width: "100vh", height: "100vh"}}>
		{children}
	</UI.Row>
);
