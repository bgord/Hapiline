import React from "react";

import {Demo} from "./_Demo";
import {Input} from "../frontend/src/ui/input/Input";
import {Button} from "../frontend/src/ui/button/Button";
import {Label} from "../frontend/src/ui/label/Label";

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
				<div
					style={{
						display: "flex",
						flexDirection: "column-reverse",
					}}
				>
					<Input id="email" type="email" placeholder="email@example.com" />
					<Label htmlFor="email" variant="optional">
						Email
					</Label>
				</div>
				<Button variant="secondary" style={{marginLeft: "12px"}}>
					Submit
				</Button>
			</form>
		</Demo>
	),
	"with label (vertically)": (
		<Demo>
			<form style={{display: "flex", alignItems: "flex-end"}}>
				<div style={{display: "flex", flexDirection: "column-reverse", marginRight: "12px"}}>
					<Input id="email" placeholder="user@example.com" />
					<Label htmlFor="email">Email</Label>
				</div>
				<div style={{display: "flex", flexDirection: "column-reverse", marginRight: "12px"}}>
					<Input id="first_name" placeholder="John Doe" />
					<Label htmlFor="first_name">First name</Label>
				</div>
				<Button variant="secondary">Submit</Button>
			</form>
		</Demo>
	),
	"with label (horizontally)": (
		<Demo>
			<form style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
				<div
					style={{
						display: "flex",
						flexDirection: "row-reverse",
						alignItems: "center",
						marginBottom: "12px",
					}}
				>
					<Input id="email" placeholder="user@example.com" />
					<Label htmlFor="email" style={{marginRight: "6px"}}>
						Email
					</Label>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "row-reverse",
						alignItems: "center",
					}}
				>
					<Input id="hfirst_nameabit_name" placeholder="John Doe" />
					<Label htmlFor="first_name" style={{marginRight: "6px"}}>
						First name
					</Label>
				</div>
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
