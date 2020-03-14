import React from "react";

import * as UI from "../frontend/src/ui/";
import {Demo} from "./_Demo";

export default {
	"all variants": (
		<Demo>
			<UI.Field variant="row">
				<UI.Checkbox id="is_trackable" />
				<UI.Label ml="6" htmlFor="is_trackable">
					Track this habit
				</UI.Label>
			</UI.Field>
			<UI.Field ml="24" variant="row">
				<UI.Checkbox id="include_in_stats" disabled />
				<UI.Label ml="6" htmlFor="include_in_stats">
					Include in stats
				</UI.Label>
			</UI.Field>
		</Demo>
	),
};
