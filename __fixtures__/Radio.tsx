import React from "react";

import {Demo} from "./_Demo";
import * as UI from "../frontend/src/ui";

export default {
	"all variants": (
		<Demo>
			<UI.Field variant="row">
				<UI.Radio id="left" name="direction" value="left" />
				<UI.Label ml="6" htmlFor="left">
					Left
				</UI.Label>
			</UI.Field>
			<UI.Field ml="24" variant="row">
				<UI.Radio id="medium" name="direction" value="medium" disabled />
				<UI.Label ml="6" htmlFor="medium">
					Medium
				</UI.Label>
			</UI.Field>
			<UI.Field ml="24" variant="row">
				<UI.Radio id="right" name="direction" value="right" />
				<UI.Label ml="6" htmlFor="right">
					Right
				</UI.Label>
			</UI.Field>
		</Demo>
	),
};
