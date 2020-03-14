import React from "react";

import {Demo} from "./_Demo";
import * as UI from "../frontend/src/ui";

export default {
	standard: (
		<Demo>
			<UI.Input placeholder="E.g Wake up at 6:30 AM" value="Wake up at 6:30 AM" />
		</Demo>
	),
	disabled: (
		<Demo>
			<UI.Input placeholder="E.g Wake up at 6:30 AM" disabled value="Wake up at 6:30 AM" />
		</Demo>
	),
	invalid: (
		<Demo>
			<form onSubmit={event => event.preventDefault()}>
				<UI.Input type="email" required placeholder="email@example.com" value="user@example," />
				<UI.Button ml="6" type="submit" variant="primary">
					Submit
				</UI.Button>
			</form>
		</Demo>
	),
	"an optional input": (
		<Demo>
			<form style={{display: "flex", alignItems: "flex-end"}}>
				<UI.Field>
					<UI.Label htmlFor="email" variant="optional">
						Email
					</UI.Label>
					<UI.Input id="email" type="email" placeholder="email@example.com" />
				</UI.Field>
				<UI.Button ml="12" variant="primary">
					Submit
				</UI.Button>
			</form>
		</Demo>
	),
	"with label (vertically)": (
		<Demo>
			<form style={{display: "flex", alignItems: "flex-end"}}>
				<UI.Field mr="12">
					<UI.Label htmlFor="email">Email</UI.Label>
					<UI.Input id="email" placeholder="user@example.com" />
				</UI.Field>
				<UI.Field mr="12">
					<UI.Label htmlFor="first_name">First name</UI.Label>
					<UI.Input id="first_name" placeholder="John Doe" />
				</UI.Field>
				<UI.Button variant="primary">Submit</UI.Button>
			</form>
		</Demo>
	),
	"with label (horizontally)": (
		<Demo>
			<form style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
				<UI.Field mb="12">
					<UI.Label mr="6" htmlFor="email">
						Email
					</UI.Label>
					<UI.Input id="email" placeholder="user@example.com" />
				</UI.Field>
				<UI.Field>
					<UI.Label mr="6" htmlFor="first_name">
						First name
					</UI.Label>
					<UI.Input id="hfirst_nameabit_name" placeholder="John Doe" />
				</UI.Field>
				<UI.Button mt="24" variant="primary">
					Submit
				</UI.Button>
			</form>
		</Demo>
	),
	"standard input side by side with a primary button": (
		<Demo>
			<UI.Input placeholder="E.g Wake up at 6:30 AM" />
			<UI.Button ml="12" variant="primary" style={{width: "75px"}}>
				Save
			</UI.Button>
		</Demo>
	),
	"disabled input side by side with a primary/outlined button": (
		<Demo>
			<UI.Input placeholder="E.g Wake up at 6:30 AM" disabled value="Wake up at 6:30 AM" />
			<UI.Button ml="12" variant="primary" style={{width: "75px"}}>
				Edit
			</UI.Button>
			<UI.Button ml="6" variant="outlined" style={{width: "75px"}}>
				Cancel
			</UI.Button>
		</Demo>
	),
};
