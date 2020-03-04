import React from "react";

import {Demo} from "./_Demo";
import {Button, Input, Field, Label} from "../frontend/src/ui";

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
				<Button ml="6" type="submit" variant="primary">
					Submit
				</Button>
			</form>
		</Demo>
	),
	"an optional input": (
		<Demo>
			<form style={{display: "flex", alignItems: "flex-end"}}>
				<Field>
					<Label htmlFor="email" variant="optional">
						Email
					</Label>
					<Input id="email" type="email" placeholder="email@example.com" />
				</Field>
				<Button ml="12" variant="primary">
					Submit
				</Button>
			</form>
		</Demo>
	),
	"with label (vertically)": (
		<Demo>
			<form style={{display: "flex", alignItems: "flex-end"}}>
				<Field mr="12">
					<Label htmlFor="email">Email</Label>
					<Input id="email" placeholder="user@example.com" />
				</Field>
				<Field mr="12">
					<Label htmlFor="first_name">First name</Label>
					<Input id="first_name" placeholder="John Doe" />
				</Field>
				<Button variant="primary">Submit</Button>
			</form>
		</Demo>
	),
	"with label (horizontally)": (
		<Demo>
			<form style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
				<Field mb="12">
					<Label mr="6" htmlFor="email">
						Email
					</Label>
					<Input id="email" placeholder="user@example.com" />
				</Field>
				<Field>
					<Label mr="6" htmlFor="first_name">
						First name
					</Label>
					<Input id="hfirst_nameabit_name" placeholder="John Doe" />
				</Field>
				<Button mt="24" variant="primary">
					Submit
				</Button>
			</form>
		</Demo>
	),
	"standard input side by side with a primary button": (
		<Demo>
			<Input placeholder="E.g Wake up at 6:30 AM" />
			<Button ml="12" variant="primary" style={{width: "75px"}}>
				Save
			</Button>
		</Demo>
	),
	"disabled input side by side with a primary/outlined button": (
		<Demo>
			<Input placeholder="E.g Wake up at 6:30 AM" disabled value="Wake up at 6:30 AM" />
			<Button ml="12" variant="primary" style={{width: "75px"}}>
				Edit
			</Button>
			<Button ml="6" variant="outlined" style={{width: "75px"}}>
				Cancel
			</Button>
		</Demo>
	),
};
