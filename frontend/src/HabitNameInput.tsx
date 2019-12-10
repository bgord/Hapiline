import React from "react";

export const HabitNameInput: React.FC<JSX.IntrinsicElements["input"]> = props => (
	<input
		required
		pattern=".{1,255}"
		title="Please, try to fit habit in 255 characters."
		id="name"
		name="name"
		type="text"
		placeholder="Wake up at 7:30 AM"
		{...props}
	/>
);
