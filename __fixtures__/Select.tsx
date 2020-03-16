import React from "react";

import {Demo} from "./_Demo";
import * as UI from "../frontend/src/ui";

export default {
	vertical: (
		<Demo>
			<UI.Field>
				<UI.Label htmlFor="type">Type</UI.Label>
				<UI.Select id="type">
					<option>Wyindywidualizowany indywidualista</option>
					<option>negative</option>
					<option>neutral</option>
				</UI.Select>
			</UI.Field>
		</Demo>
	),
	horizontal: (
		<Demo>
			<UI.Field variant="row" style={{justifyContent: "center", alignItems: "center"}}>
				<UI.Label mr="12" htmlFor="type">
					Type
				</UI.Label>
				<UI.Select id="type">
					<option>Wyindywidualizowany indywidualista</option>
					<option>negative</option>
					<option>neutral</option>
				</UI.Select>
			</UI.Field>
		</Demo>
	),
	"side-by-side with intput": (
		<Demo>
			<UI.Field>
				<UI.Label htmlFor="type">Type</UI.Label>
				<UI.Select id="type">
					<option>Wyindywidualizowany indywidualista</option>
					<option>negative</option>
					<option>neutral</option>
				</UI.Select>
			</UI.Field>
			<UI.Field ml="12">
				<UI.Label htmlFor="name">Name</UI.Label>
				<UI.Input id="name" placeholder="Wake up at 6:30 AM" />
			</UI.Field>
		</Demo>
	),
};
