import React from "react";

import {Checkbox, Field, Label} from "../frontend/src/ui/";
import {Demo} from "./_Demo";

export default {
	"all variants": (
		<Demo>
			<Field variant="row">
				<Checkbox id="is_trackable" />
				<Label ml="6" htmlFor="is_trackable">
					Track this habit
				</Label>
			</Field>
			<Field ml="24" variant="row">
				<Checkbox id="include_in_stats" disabled />
				<Label ml="6" htmlFor="include_in_stats">
					Include in stats
				</Label>
			</Field>
		</Demo>
	),
};
