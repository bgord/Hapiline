import React from "react";

import {Button} from "../frontend/src/ui/button/Button";
import {Demo} from "./_Demo";
import {Field} from "../frontend/src/ui/field/Field";
import {Header} from "../frontend/src/ui/header/Header";
import {Input} from "../frontend/src/ui/input/Input";
import {Label} from "../frontend/src/ui/label/Label";

export default {
	standard: (
		<Demo>
			<Header>Habit list</Header>
		</Demo>
	),
	"as a form header": (
		<Demo>
			<form
				style={{
					width: "300px",
					background: "white",
					padding: "24px",
					boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
				}}
			>
				<Header>Login</Header>
				<Field style={{marginTop: "36px"}}>
					<Label htmlFor="email">Email</Label>
					<Input id="email" placeholder="user@example.com" />
				</Field>
				<Field style={{marginTop: "12px"}}>
					<Label htmlFor="password">Password</Label>
					<Input id="password" type="password" placeholder="*********" />
				</Field>
				<Button variant="primary" style={{marginTop: "24px", width: "100%"}}>
					Login
				</Button>
			</form>
		</Demo>
	),
};
