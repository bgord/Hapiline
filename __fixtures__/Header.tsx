import React from "react";

import {Button, Column, Header, Field, Label, Input} from "../frontend/src/ui";
import {Demo} from "./_Demo";

export default {
	"all variants": (
		<Demo>
			<Column>
				<Header mt="24" variant="extra-small">
					Habit list
				</Header>
				<Header mt="24" variant="small">
					Habit list
				</Header>
				<Header mt="24" variant="medium">
					Habit list
				</Header>
				<Header mt="24" variant="large">
					Habit list
				</Header>
			</Column>
		</Demo>
	),
	"as a form header": (
		<Demo>
			<form
				style={{
					width: "300px",
					background: "white",
					boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
					padding: "24px",
				}}
			>
				<Header mt="12">Login</Header>
				<Field mt="48">
					<Label htmlFor="email">Email</Label>
					<Input id="email" placeholder="user@example.com" />
				</Field>
				<Field mt="12">
					<Label htmlFor="password">Password</Label>
					<Input id="password" type="password" placeholder="*********" />
				</Field>
				<Button data-width="100%" mt="24" variant="primary">
					Login
				</Button>
			</form>
		</Demo>
	),
};
