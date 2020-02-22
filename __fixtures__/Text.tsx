import React from "react";

import {Column} from "../frontend/src/ui/column/Column";
import {Demo} from "./_Demo";
import {Text} from "../frontend/src/ui/text/Text";

export default {
	"all variants": (
		<Demo>
			<Column>
				<Text>Working on Hapiline 5 minutes a day</Text>
				<Text variant="bold">2020-02-02</Text>
				<Text variant="dimmed">Future vote comments will appear here.</Text>
			</Column>
		</Demo>
	),
};
