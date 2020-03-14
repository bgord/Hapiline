import React from "react";

import {Demo} from "./_Demo";
import * as UI from "../frontend/src/ui";

export default {
	"all variants": (
		<Demo>
			<UI.Badge variant="positive">Positive</UI.Badge>
			<UI.Badge ml="24" variant="negative">
				Negative
			</UI.Badge>
			<UI.Badge ml="24" variant="neutral">
				Neutral
			</UI.Badge>
			<UI.Badge ml="24" variant="light">
				Fresh
			</UI.Badge>
			<UI.Badge ml="24" variant="normal">
				Developing
			</UI.Badge>
			<UI.Badge ml="24" variant="strong">
				Established
			</UI.Badge>
		</Demo>
	),
};
