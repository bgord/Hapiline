import React from "react";

import {Demo} from "./_Demo";
import {Badge} from "../frontend/src/ui/badge/Badge";

export default {
	"all variants": (
		<Demo>
			<Badge variant="positive">Positive</Badge>
			<Badge data-ml="24" variant="negative">
				Negative
			</Badge>
			<Badge data-ml="24" variant="neutral">
				Neutral
			</Badge>
			<Badge data-ml="24" variant="light">
				Fresh
			</Badge>
			<Badge data-ml="24" variant="normal">
				Developing
			</Badge>
			<Badge data-ml="24" variant="strong">
				Established
			</Badge>
		</Demo>
	),
};