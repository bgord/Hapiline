import React from "react";

import {Demo} from "./_Demo";
import {Divider} from "../frontend/src/ui/divider/Divider";
import {Header} from "../frontend/src/ui/header/Header";

export default {
	standard: (
		<Demo>
			<Divider />
		</Demo>
	),
	"section separator": (
		<Demo>
			<div style={{display: "flex", flexDirection: "column", width: "350px"}}>
				<Header variant="large">User profile</Header>
				<Divider style={{marginTop: "6px"}} />
			</div>
		</Demo>
	),
};
