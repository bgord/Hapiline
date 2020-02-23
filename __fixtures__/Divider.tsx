import React from "react";

import {Column} from "../frontend/src/ui/column/Column";
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
			<Column style={{width: "350px"}}>
				<Header variant="large">User profile</Header>
				<Divider />
			</Column>
		</Demo>
	),
};
