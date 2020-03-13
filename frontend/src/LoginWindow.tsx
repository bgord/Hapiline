import {useHistory, Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useUserProfile} from "./contexts/auth-context";
import {Button, Column, Header, Label, Input, Row, Card, Text, Field, ErrorBanner} from "./ui";

export const LoginWindow: React.FC = () => {
	const history = useHistory();

	const [, setUserProfile] = useUserProfile();

	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	const loginRequestState = Async.useAsync({
		deferFn: api.auth.login,
		history,
		setUserProfile,
	});
	const {errorMessage} = getRequestStateErrors(loginRequestState);

	return (
		<Card py="48" px="24" mx="auto" mt="72">
			<form
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					loginRequestState.run(email, password);
				}}
			>
				<Column>
					<Header>Login</Header>

					<Field mt="48">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							value={email}
							onChange={event => setEmail(event.target.value)}
							required
							type="email"
							placeholder="john.brown@gmail.com"
							style={{width: "500px"}}
						/>
					</Field>

					<Field mt="12">
						<Label htmlFor="password">Password</Label>
						<Input
							required
							pattern=".{6,}"
							title="Password should contain at least 6 characters."
							value={password}
							onChange={event => setPassword(event.target.value)}
							type="password"
							id="password"
							placeholder="*********"
						/>
					</Field>

					<Row mt="24" mainAxis="end">
						<Button
							type="submit"
							variant="primary"
							disabled={loginRequestState.isPending}
							data-testid="login-submit"
							style={{width: "125px"}}
						>
							{loginRequestState.isPending ? "Loading..." : "Login"}
						</Button>
					</Row>

					<Row mt="24">
						<Text>Don't have an account?</Text>
						<Link data-variant="link" data-ml="6" className="c-text" to="/register">
							Create now
						</Link>
					</Row>
					<Link data-mt="6" data-variant="link" className="c-text" to="/forgot-password">
						Forgot password?
					</Link>

					<Async.IfRejected state={loginRequestState}>
						<ErrorBanner mt="24" p="6">
							{errorMessage}
						</ErrorBanner>
					</Async.IfRejected>
				</Column>
			</form>
		</Card>
	);
};
