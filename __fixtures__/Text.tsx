import React from "react";

import {Demo} from "./_Demo";
import {Text} from "../frontend/src/ui/text/Text";

export default {
	"all variants": (
		<Demo>
			<div style={{display: "flex", flexDirection: "column"}}>
				<Text>Working on Hapiline 5 minutes a day</Text>
				<Text variant="bold">2020-02-02</Text>
			</div>
		</Demo>
	),
};
