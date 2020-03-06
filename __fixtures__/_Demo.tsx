import "../frontend/css/main.css";
import React from "react";
import {Row} from "../frontend/src/ui/row/Row";

export const Demo: React.FC = ({children}) => (
	<Row pt="24" pl="24" crossAxis="start" style={{width: "100vh", height: "100vh"}}>
		{children}
	</Row>
);
