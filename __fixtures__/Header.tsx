import React from "react";

import * as UI from "../frontend/src/ui";
import {Demo} from "./_Demo";

export default {
	"all variants": (
		<Demo>
			<UI.Column>
				<UI.Header mt="24" variant="extra-small">
					Habit list
				</UI.Header>
				<UI.Header mt="24" variant="small">
					Habit list
				</UI.Header>
				<UI.Header mt="24" variant="medium">
					Habit list
				</UI.Header>
				<UI.Header mt="24" variant="large">
					Habit list
				</UI.Header>
			</UI.Column>
		</Demo>
	),
	"as a form header": (
		<Demo>
			<UI.Column
				bg="white"
				as="form"
				p="24"
				style={{width: "300px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"}}
			>
				<UI.Header mt="12">Login</UI.Header>
				<UI.Field mt="48">
					<UI.Label htmlFor="email">Email</UI.Label>
					<UI.Input id="email" placeholder="user@example.com" />
				</UI.Field>
				<UI.Field mt="12">
					<UI.Label htmlFor="password">Password</UI.Label>
					<UI.Input id="password" type="password" placeholder="*********" />
				</UI.Field>
				<UI.Button data-width="100%" mt="24" variant="primary">
					Login
				</UI.Button>
			</UI.Column>
		</Demo>
	),
};
