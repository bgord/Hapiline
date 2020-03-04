import React from "react";

import {Column, Divider, Header} from "../frontend/src/ui";
import {Demo} from "./_Demo";

export default {
	standard: (
		<Demo>
			<Divider />
		</Demo>
	),
	"section separator": (
		<Demo>
			<Column style={{width: "350px"}}>
				<Header variant="large">User profile</Header>
				<Divider />
			</Column>
		</Demo>
	),
};
