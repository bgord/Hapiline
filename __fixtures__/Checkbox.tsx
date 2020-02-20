import React from "react";

import {Checkbox} from "../frontend/src/ui/checkbox/Checkbox";
import {Demo} from "./_Demo";
import {Field} from "../frontend/src/ui/field/Field";
import {Label} from "../frontend/src/ui/label/Label";

export default {
	"all variants": (
		<Demo>
			<Field variant="row">
				<Checkbox id="is_trackable" />
				<Label htmlFor="is_trackable" style={{marginLeft: "4px"}}>
					Track this habit
				</Label>
			</Field>
			<Field variant="row" style={{marginLeft: "24px"}}>
				<Checkbox id="include_in_stats" disabled />
				<Label htmlFor="include_in_stats" style={{marginLeft: "4px"}}>
					Include in stats
				</Label>
			</Field>
		</Demo>
	),
};
