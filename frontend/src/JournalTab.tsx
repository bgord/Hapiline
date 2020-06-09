import React from "react";
import * as UI from "./ui";

export const JournalTab = () => (
	<UI.Row p="24">
		<UI.Field width="100%">
			<UI.Label htmlFor="journal">Journal</UI.Label>
			<UI.Textarea id="journal" value="Ok, so that's it? That's all you wanted to say?" />
		</UI.Field>
	</UI.Row>
);
