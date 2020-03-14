import * as Async from "react-async";
import React from "react";

import * as UI from "./ui";
import {api} from "./services/api";

export const ForgotPasswordWindow: React.FC = () => {
	const [email, setEmail] = React.useState("");

	const forgotPasswordRequestState = Async.useAsync({
		deferFn: api.auth.forgotPassword,
		onResolve: () => setEmail(""),
	});

	return (
		<UI.Card py="48" px="24" mx="auto" mt="72">
			<UI.Column
				as="form"
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					forgotPasswordRequestState.run(email);
				}}
			>
				<UI.Header>Forgot password</UI.Header>

				<UI.Field mt="48">
					<UI.Label htmlFor="email">Email</UI.Label>
					<UI.Input
						type="email"
						id="email"
						value={email}
						required
						onChange={event => setEmail(event.target.value)}
						placeholder="john.brown@gmail.com"
						style={{width: "500px"}}
					/>
				</UI.Field>

				<UI.Row mt="24" mainAxis="end">
					<UI.Button
						variant="primary"
						type="submit"
						disabled={forgotPasswordRequestState.isPending}
						style={{width: "125px"}}
					>
						{forgotPasswordRequestState.isPending ? "Loading..." : "Send email"}
					</UI.Button>
				</UI.Row>

				<Async.IfFulfilled state={forgotPasswordRequestState}>
					<UI.Banner mt="24" variant="success" p="6">
						<UI.Text>Email sent if an account exists.</UI.Text>
					</UI.Banner>
				</Async.IfFulfilled>
			</UI.Column>
		</UI.Card>
	);
};
