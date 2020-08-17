import * as UI from "./ui";
import React from "react";

import omit from "lodash.omit";

export function HabitNameInput(props: JSX.IntrinsicElements["input"]) {
	return (
		<UI.Input
			required
			pattern=".{1,255}"
			title="Please, try to fit habit in 255 characters."
			id="habit_name"
			type="text"
			placeholder="Wake up at 7:30 AM"
			{...omit(props, "ref")}
		/>
	);
}
