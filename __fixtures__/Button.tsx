import React from "react";
import {Demo} from "./_Demo";
import {Button} from "../frontend/src/ui/button/Button";

export default {
	"--normal": (
		<Demo>
			<Button variant="normal">Reset filters</Button>
			<Button variant="normal" style={{marginLeft: "25px"}} disabled>
				Reset filters
			</Button>
		</Demo>
	),
	"--primary": (
		<Demo>
			<Button variant="primary">New habit</Button>
			<Button variant="primary" style={{marginLeft: "25px"}} disabled>
				New habit
			</Button>
		</Demo>
	),
	"--outlined": (
		<Demo>
			<Button variant="outlined" style={{marginLeft: "10px"}}>
				Cancel
			</Button>
			<Button variant="outlined" style={{marginLeft: "10px"}} disabled>
				Cancel
			</Button>
		</Demo>
	),
	"side by side": (
		<Demo>
			<Button variant="primary">New habit</Button>
			<Button variant="normal" style={{marginLeft: "10px"}}>
				Show filters
			</Button>
			<Button variant="outlined" style={{marginLeft: "10px"}}>
				Hide
			</Button>
		</Demo>
	),
};
