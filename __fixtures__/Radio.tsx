import React from "react";

import {Demo} from "./_Demo";
import {Field, Label, Radio} from "../frontend/src/ui";

export default {
	"all variants": (
		<Demo>
			<Field variant="row">
				<Radio id="left" name="direction" value="left" />
				<Label ml="6" htmlFor="left">
					Left
				</Label>
			</Field>
			<Field ml="24" variant="row">
				<Radio id="medium" name="direction" value="medium" disabled />
				<Label ml="6" htmlFor="medium">
					Medium
				</Label>
			</Field>
			<Field ml="24" variant="row">
				<Radio id="right" name="direction" value="right" />
				<Label ml="6" htmlFor="right">
					Right
				</Label>
			</Field>
		</Demo>
	),
};
