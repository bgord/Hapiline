import React from "react";

import * as UI from "../frontend/src/ui";
import {Demo} from "./_Demo";

export default {
	standard: (
		<Demo>
			<UI.Textarea />
		</Demo>
	),
	"with label": (
		<Demo>
			<UI.Field width="100%" style={{maxWidth: "400px"}}>
				<UI.Label htmlFor="description">Description</UI.Label>
				<UI.Textarea id="description" />
			</UI.Field>
		</Demo>
	),
	disabled: (
		<Demo>
			<UI.Field width="100%" style={{maxWidth: "400px"}}>
				<UI.Label htmlFor="description">Description</UI.Label>
				<UI.Textarea
					disabled
					id="description"
					value="Ok, so that's it? That's all you wanted to say?"
				/>
			</UI.Field>
		</Demo>
	),
	"stacked with an input": (
		<Demo>
			<form data-width="100%" style={{maxWidth: "400px"}}>
				<UI.Field mb="12">
					<UI.Label htmlFor="last_name">Last name</UI.Label>
					<UI.Input id="last_name" placeholder="John doe" />
				</UI.Field>
				<UI.Field>
					<UI.Label htmlFor="description">Description</UI.Label>
					<UI.Textarea id="description" />
				</UI.Field>
				<UI.Row mt="24" mainAxis="end">
					<UI.Button variant="primary">Add person</UI.Button>
				</UI.Row>
			</form>
		</Demo>
	),
};
