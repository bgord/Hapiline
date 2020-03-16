import React from "react";
import {Demo} from "./_Demo";
import * as UI from "../frontend/src/ui";

export default {
	standard: (
		<Demo>
			<UI.CloseIcon />
		</Demo>
	),
	"side by side with a primary button": (
		<Demo>
			<UI.Button variant="primary">New habit</UI.Button>
			<UI.CloseIcon ml="12" />
		</Demo>
	),
	"side by side with a secondary button": (
		<Demo>
			<UI.Button variant="secondary">Show filters</UI.Button>
			<UI.CloseIcon ml="12" />
		</Demo>
	),
};
