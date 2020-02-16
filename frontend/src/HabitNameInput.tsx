import {Input} from "./ui/input/Input";
import React from "react";

export const HabitNameInput: React.FC<JSX.IntrinsicElements["input"]> = props => (
	<Input
		required
		pattern=".{1,255}"
		title="Please, try to fit habit in 255 characters."
		id="name"
		name="habit_name"
		type="text"
		placeholder="Wake up at 7:30 AM"
		{...props}
	/>
);
