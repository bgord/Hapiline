import React from "react";
import {Demo} from "./_Demo";
import {Button} from "../frontend/src/ui/button/Button";

export default {
	"--secondary": (
		<Demo>
			<Button variant="secondary">Reset filters</Button>
			<Button ml="24" variant="secondary" disabled>
				Reset filters
			</Button>
		</Demo>
	),
	"--primary": (
		<Demo>
			<Button variant="primary">New habit</Button>
			<Button ml="24" variant="primary" disabled>
				New habit
			</Button>
		</Demo>
	),
	"--outlined": (
		<Demo>
			<Button ml="12" variant="outlined">
				Cancel
			</Button>
			<Button ml="12" variant="outlined" disabled>
				Cancel
			</Button>
		</Demo>
	),
	"side by side": (
		<Demo>
			<Button variant="primary">New habit</Button>
			<Button ml="12" variant="secondary">
				Show filters
			</Button>
			<Button ml="12" variant="outlined">
				Hide
			</Button>
		</Demo>
	),
};
