import * as Async from "react-async";
import React from "react";

import {Button} from "./ui/button/Button";
import {Field} from "./ui/field/Field";
import {Header} from "./ui/header/Header";
import {Input} from "./ui/input/Input";
import {Label} from "./ui/label/Label";
import {Row} from "./ui/row/Row";
import {Text} from "./ui/text/Text";
import {api} from "./services/api";

export const ForgotPasswordWindow: React.FC = () => {
	const [email, setEmail] = React.useState("");

	const forgotPasswordRequestState = Async.useAsync({
		deferFn: api.auth.forgotPassword,
		onResolve: () => setEmail(""),
	});

	return (
		<div className="bg-white rounded shadow-lg p-8 sm:max-w-sm sm:mx-auto">
			<form
				onSubmit={event => {
					event.preventDefault();
					forgotPasswordRequestState.run(email);
				}}
				className="sm:flex sm:flex-wrap sm:justify-between"
			>
				<Header>Forgot password</Header>
				<Field width="100%" mt="48">
					<Label htmlFor="email">Email</Label>
					<Input
						type="email"
						id="email"
						value={email}
						required
						onChange={event => setEmail(event.target.value)}
						placeholder="john.brown@gmail.com"
					/>
				</Field>
				<Row mt="24" mainAxis="end">
					<Button
						variant="primary"
						type="submit"
						disabled={forgotPasswordRequestState.isPending}
						style={{width: "125px"}}
					>
						{forgotPasswordRequestState.isPending ? "Loading..." : "Send email"}
					</Button>
				</Row>
				<Async.IfFulfilled state={forgotPasswordRequestState}>
					<Text>Email sent if an account exists.</Text>
				</Async.IfFulfilled>
			</form>
		</div>
	);
};
