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
	"side by side with a secondary button": (
		<Demo>
			<Button variant="secondary">New habit</Button>
			<CloseIcon style={{marginLeft: "10px"}} />
		</Demo>
	),
	"side by side with a normal button": (
		<Demo>
			<Button variant="normal">Show filters</Button>
			<CloseIcon style={{marginLeft: "10px"}} />
		</Demo>
	),
};
