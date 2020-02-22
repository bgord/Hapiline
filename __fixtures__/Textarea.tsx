import React from "react";

import {Button} from "../frontend/src/ui/button/Button";
import {Demo} from "./_Demo";
import {Field} from "../frontend/src/ui/field/Field";
import {Input} from "../frontend/src/ui/input/Input";
import {Label} from "../frontend/src/ui/label/Label";
import {Row} from "../frontend/src/ui/row/Row";
import {Textarea} from "../frontend/src/ui/textarea/Textarea";

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
				<Field mb="12">
					<Label htmlFor="last_name">Last name</Label>
					<Input id="last_name" placeholder="John doe" />
				</Field>
				<Field>
					<Label htmlFor="description">Description</Label>
					<Textarea id="description" />
				</Field>
				<Row mainAxis="end" style={{marginTop: "18px"}}>
					<Button variant="primary">Add person</Button>
				</Row>
			</form>
		</Demo>
	),
};
