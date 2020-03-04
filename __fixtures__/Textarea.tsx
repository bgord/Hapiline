import React from "react";

import {Button, Textarea, Label, Field, Input, Row} from "../frontend/src/ui";
import {Demo} from "./_Demo";

export default {
	standard: (
		<Demo>
			<Textarea />
		</Demo>
	),
	"with label": (
		<Demo>
			<Field width="100%" style={{maxWidth: "400px"}}>
				<Label htmlFor="description">Description</Label>
				<Textarea id="description" />
			</Field>
		</Demo>
	),
	disabled: (
		<Demo>
			<Field width="100%" style={{maxWidth: "400px"}}>
				<Label htmlFor="description">Description</Label>
				<Textarea
					disabled
					id="description"
					value="Ok, so that's it? That's all you wanted to say?"
				/>
			</Field>
		</Demo>
	),
	"stacked with an input": (
		<Demo>
			<form data-width="100%" style={{maxWidth: "400px"}}>
				<Field mb="12">
					<Label htmlFor="last_name">Last name</Label>
					<Input id="last_name" placeholder="John doe" />
				</Field>
				<Field>
					<Label htmlFor="description">Description</Label>
					<Textarea id="description" />
				</Field>
				<Row mt="24" mainAxis="end">
					<Button variant="primary">Add person</Button>
				</Row>
			</form>
		</Demo>
	),
};
