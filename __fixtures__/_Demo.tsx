import "../frontend/css/main.css";
import React from "react";
import * as UI from "../frontend/src/ui";

export function Demo({children}: UI.WithChildren<{}>) {
	return (
		<UI.Row pt="24" pl="24" crossAxis="start" style={{width: "100vh", height: "100vh"}}>
			{children}
		</UI.Row>
	);
}
