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
			<Field style={{maxWidth: "400px", width: "100%"}}>
				<Label htmlFor="description">Description</Label>
				<Textarea id="description" />
			</Field>
		</Demo>
	),
	disabled: (
		<Demo>
			<Field style={{maxWidth: "400px", width: "100%"}}>
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
			<form style={{maxWidth: "400px", width: "100%"}}>
				<Field style={{marginBottom: "12px"}}>
					<Label htmlFor="last_name">Last name</Label>
					<Input id="last_name" placeholder="John doe" />
				</Field>
				<Field>
					<Label htmlFor="description">Description</Label>
					<Textarea id="description" />
				</Field>
				<div style={{display: "flex", justifyContent: "flex-end", marginTop: "18px"}}>
					<Button variant="primary">Add person</Button>
				</div>
			</form>
		</Demo>
	),
};
