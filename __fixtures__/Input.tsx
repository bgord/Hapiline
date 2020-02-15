import React from "react";

import {Demo} from "./_Demo";
import {Input} from "../frontend/src/ui/input/Input";
import {Button} from "../frontend/src/ui/button/Button";

export default {
	standard: (
		<Demo>
			<Input placeholder="E.g Wake up at 6:30 AM" value="Wake up at 6:30 AM" />
		</Demo>
	),
	disabled: (
		<Demo>
			<Input placeholder="E.g Wake up at 6:30 AM" disabled value="Wake up at 6:30 AM" />
		</Demo>
	),
	invalid: (
		<Demo>
			<form onSubmit={event => event.preventDefault()}>
				<Input type="email" required placeholder="email@example.com" value="user@example," />
				<Button type="submit" variant="secondary" style={{marginLeft: "6px"}}>
					Submit
				</Button>
			</form>
		</Demo>
	),
	"standard input side by side with a secondary button": (
		<Demo>
			<Input placeholder="E.g Wake up at 6:30 AM" />
			<Button variant="secondary" style={{marginLeft: "12px", width: "75px"}}>
				Save
			</Button>
		</Demo>
	),
	"disabled input side by side with a secondary/outlined button": (
		<Demo>
			<Input placeholder="E.g Wake up at 6:30 AM" disabled value="Wake up at 6:30 AM" />
			<Button variant="secondary" style={{marginLeft: "12px", width: "75px"}}>
				Edit
			</Button>
			<Button variant="outlined" style={{marginLeft: "6px", width: "75px"}}>
				Cancel
			</Button>
		</Demo>
	),
};
