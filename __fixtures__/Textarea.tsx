import React from "react";

import {Demo} from "./_Demo";
import {Textarea} from "../frontend/src/ui/textarea/Textarea";
import {Label} from "../frontend/src/ui/label/Label";
import {Input} from "../frontend/src/ui/input/Input";
import {Button} from "../frontend/src/ui/button/Button";
import {Field} from "../frontend/src/ui/field/Field";

export default {
	standard: (
		<Demo>
			<Textarea />
		</Demo>
	),
	"with label": (
		<Demo>
			<Field variant="column" style={{maxWidth: "400px", width: "100%"}}>
				<Textarea id="description" />
				<Label htmlFor="description">Description</Label>
			</Field>
		</Demo>
	),
	disabled: (
		<Demo>
			<Field variant="column" style={{maxWidth: "400px", width: "100%"}}>
				<Textarea
					disabled
					id="description"
					value="Ok, so that's it? That's all you wanted to say?"
				/>
				<Label htmlFor="description">Description</Label>
			</Field>
		</Demo>
	),
	"stacked with an input": (
		<Demo>
			<form style={{maxWidth: "400px", width: "100%"}}>
				<Field variant="column" style={{marginBottom: "12px"}}>
					<Input id="last_name" placeholder="John doe" />
					<Label htmlFor="last_name">Last name</Label>
				</Field>
				<Field variant="column">
					<Textarea id="description" />
					<Label htmlFor="description">Description</Label>
				</Field>
				<div style={{display: "flex", justifyContent: "flex-end", marginTop: "18px"}}>
					<Button variant="secondary">Add person</Button>
				</div>
			</form>
		</Demo>
	),
};
