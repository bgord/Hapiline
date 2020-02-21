import React from "react";

import {Demo} from "./_Demo";
import {Field} from "../frontend/src/ui/field/Field";
import {Input} from "../frontend/src/ui/input/Input";
import {Label} from "../frontend/src/ui/label/Label";
import {Select} from "../frontend/src/ui/select/Select";

export default {
	vertical: (
		<Demo>
			<Field>
				<Label htmlFor="type">Type</Label>
				<Select id="type">
					<option>Wyindywidualizowany indywidualista</option>
					<option>negative</option>
					<option>neutral</option>
				</Select>
			</Field>
		</Demo>
	),
	horizontal: (
		<Demo>
			<Field
				variant="row"
				style={{display: "flex", justifyContent: "center", alignItems: "center"}}
			>
				<Label htmlFor="type" style={{marginRight: "12px"}}>
					Type
				</Label>
				<Select id="type">
					<option>Wyindywidualizowany indywidualista</option>
					<option>negative</option>
					<option>neutral</option>
				</Select>
			</Field>
		</Demo>
	),
	"side-by-side with intput": (
		<Demo>
			<Field>
				<Label htmlFor="type">Type</Label>
				<Select id="type">
					<option>Wyindywidualizowany indywidualista</option>
					<option>negative</option>
					<option>neutral</option>
				</Select>
			</Field>
			<Field style={{marginLeft: "12px"}}>
				<Label htmlFor="name">Name</Label>
				<Input id="name" placeholder="Wake up at 6:30 AM" />
			</Field>
		</Demo>
	),
};
