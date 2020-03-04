import * as Async from "react-async";
import React from "react";

import {Button, Text, Card, Column, Row, Field, Input, Header, Label} from "./ui";
import {api} from "./services/api";

export const ForgotPasswordWindow: React.FC = () => {
	const [email, setEmail] = React.useState("");

	const forgotPasswordRequestState = Async.useAsync({
		deferFn: api.auth.forgotPassword,
		onResolve: () => setEmail(""),
	});

	return (
		<Card py="48" px="24" mx="auto" mt="72">
			<form
				onSubmit={event => {
					event.preventDefault();
					forgotPasswordRequestState.run(email);
				}}
			>
				<Column>
					<Header>Forgot password</Header>
					<Field mt="48">
						<Label htmlFor="email">Email</Label>
						<Input
							type="email"
							id="email"
							value={email}
							required
							onChange={event => setEmail(event.target.value)}
							placeholder="john.brown@gmail.com"
							style={{width: "500px"}}
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
						<Text mt="24">Email sent if an account exists.</Text>
					</Async.IfFulfilled>
				</Column>
			</form>
		</Card>
	);
};
