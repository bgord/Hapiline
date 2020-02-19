import React from "react";

import {Demo} from "./_Demo";
import {Field} from "../frontend/src/ui/field/Field";
import {Label} from "../frontend/src/ui/label/Label";
import {Radio} from "../frontend/src/ui/radio/Radio";

export default {
	"all variants": (
		<Demo>
			<Field variant="row">
				<Radio id="left" name="direction" value="left" />
				<Label htmlFor="left" style={{marginLeft: "4px"}}>
					Left
				</Label>
			</Field>
			<Field variant="row" style={{marginLeft: "24px"}}>
				<Radio id="medium" name="direction" value="medium" disabled />
				<Label htmlFor="medium" style={{marginLeft: "4px"}}>
					Medium
				</Label>
			</Field>
			<Field variant="row" style={{marginLeft: "24px"}}>
				<Radio id="right" name="direction" value="right" />
				<Label htmlFor="right" style={{marginLeft: "4px"}}>
					Right
				</Label>
			</Field>
		</Demo>
	),
};
