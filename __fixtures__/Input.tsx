import React from "react";

import {Demo} from "./_Demo";
import {Input} from "../frontend/src/ui/input/Input";
import {Button} from "../frontend/src/ui/button/Button";
import {Label} from "../frontend/src/ui/label/Label";
import {Field} from "../frontend/src/ui/field/Field";

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
	"an optional input": (
		<Demo>
			<form style={{display: "flex", alignItems: "flex-end"}}>
				<Field variant="column">
					<Label htmlFor="email" variant="optional">
						Email
					</Label>
					<Input id="email" type="email" placeholder="email@example.com" />
				</Field>
				<Button variant="secondary" style={{marginLeft: "12px"}}>
					Submit
				</Button>
			</form>
		</Demo>
	),
	"with label (vertically)": (
		<Demo>
			<form style={{display: "flex", alignItems: "flex-end"}}>
				<Field variant="column" style={{marginRight: "12px"}}>
					<Label htmlFor="email">Email</Label>
					<Input id="email" placeholder="user@example.com" />
				</Field>
				<Field variant="column" style={{marginRight: "12px"}}>
					<Label htmlFor="first_name">First name</Label>
					<Input id="first_name" placeholder="John Doe" />
				</Field>
				<Button variant="secondary">Submit</Button>
			</form>
		</Demo>
	),
	"with label (horizontally)": (
		<Demo>
			<form style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
				<Field variant="row" style={{alignItems: "center", marginBottom: "12px"}}>
					<Label htmlFor="email" style={{marginRight: "6px"}}>
						Email
					</Label>
					<Input id="email" placeholder="user@example.com" />
				</Field>
				<Field variant="row" style={{alignItems: "center"}}>
					<Label htmlFor="first_name" style={{marginRight: "6px"}}>
						First name
					</Label>
					<Input id="hfirst_nameabit_name" placeholder="John Doe" />
				</Field>
				<Button variant="secondary" style={{marginTop: "18px"}}>
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
