import React from "react";
import {Demo} from "./_Demo";
import * as UI from "../frontend/src/ui";

export default {
	"--secondary": (
		<Demo>
			<UI.Button variant="secondary">Reset filters</UI.Button>
			<UI.Button ml="24" variant="secondary" disabled>
				Reset filters
			</UI.Button>
		</Demo>
	),
	"--primary": (
		<Demo>
			<UI.Button variant="primary">New habit</UI.Button>
			<UI.Button ml="24" variant="primary" disabled>
				New habit
			</UI.Button>
		</Demo>
	),
	"--outlined": (
		<Demo>
			<UI.Button ml="12" variant="outlined">
				Cancel
			</UI.Button>
			<UI.Button ml="12" variant="outlined" disabled>
				Cancel
			</UI.Button>
		</Demo>
	),
	"side by side": (
		<Demo>
			<UI.Button variant="primary">New habit</UI.Button>
			<UI.Button ml="12" variant="secondary">
				Show filters
			</UI.Button>
			<UI.Button ml="12" variant="outlined">
				Hide
			</UI.Button>
		</Demo>
	),
};
