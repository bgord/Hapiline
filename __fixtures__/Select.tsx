import React from "react";

import {Demo} from "./_Demo";
import {Field, Label, Select, Input} from "../frontend/src/ui";

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
			<Field variant="row" style={{justifyContent: "center", alignItems: "center"}}>
				<Label mr="12" htmlFor="type">
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
			<Field ml="12">
				<Label htmlFor="name">Name</Label>
				<Input id="name" placeholder="Wake up at 6:30 AM" />
			</Field>
		</Demo>
	),
};
