import React from "react";

import * as UI from "../frontend/src/ui";
import {Demo} from "./_Demo";

export default {
	"all variants": (
		<Demo>
			<UI.Column>
				<UI.Text>Working on Hapiline 5 minutes a day</UI.Text>
				<UI.Text variant="bold">2020-02-02</UI.Text>
				<UI.Text variant="dimmed">Future vote comments will appear here.</UI.Text>
			</UI.Column>
		</Demo>
	),
};
