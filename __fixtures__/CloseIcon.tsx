import React from "react";
import {Demo} from "./_Demo";
import {CloseIcon} from "../frontend/src/ui/close-icon/CloseIcon";
import {Button} from "../frontend/src/ui/button/Button";

export default {
	standard: (
		<Demo>
			<CloseIcon />
		</Demo>
	),
	"side by side with a primary button": (
		<Demo>
			<Button variant="primary">New habit</Button>
			<CloseIcon style={{marginLeft: "10px"}} />
		</Demo>
	),
	"side by side with a secondary button": (
		<Demo>
			<Button variant="secondary">Show filters</Button>
			<CloseIcon style={{marginLeft: "10px"}} />
		</Demo>
	),
};
