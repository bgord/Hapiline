import React from "react";

import {Demo} from "./_Demo";
import {Badge} from "../frontend/src/ui";

export default {
	"all variants": (
		<Demo>
			<Badge variant="positive">Positive</Badge>
			<Badge ml="24" variant="negative">
				Negative
			</Badge>
			<Badge ml="24" variant="neutral">
				Neutral
			</Badge>
			<Badge ml="24" variant="light">
				Fresh
			</Badge>
			<Badge ml="24" variant="normal">
				Developing
			</Badge>
			<Badge ml="24" variant="strong">
				Established
			</Badge>
		</Demo>
	),
};
