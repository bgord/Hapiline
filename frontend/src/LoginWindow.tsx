import {useHistory, Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useUserProfile} from "./contexts/auth-context";
import * as UI from "./ui";

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
		<UI.Card py="48" px="24" mx="auto" mt="72">
			<UI.Column
				as="form"
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					loginRequestState.run(email, password);
				}}
			>
				<UI.Header>Login</UI.Header>

				<UI.Field mt="48">
					<UI.Label htmlFor="email">Email</UI.Label>
					<UI.Input
						id="email"
						value={email}
						onChange={event => setEmail(event.target.value)}
						required
						type="email"
						placeholder="john.brown@gmail.com"
						style={{width: "500px"}}
					/>
				</UI.Field>

				<UI.Field mt="12">
					<UI.Label htmlFor="password">Password</UI.Label>
					<UI.Input
						required
						pattern=".{6,}"
						title="Password should contain at least 6 characters."
						value={password}
						onChange={event => setPassword(event.target.value)}
						type="password"
						id="password"
						placeholder="*********"
					/>
				</UI.Field>

				<UI.Row mt="24" mainAxis="end">
					<UI.Button
						type="submit"
						variant="primary"
						disabled={loginRequestState.isPending}
						data-testid="login-submit"
						style={{width: "125px"}}
					>
						{loginRequestState.isPending ? "Loading..." : "Login"}
					</UI.Button>
				</UI.Row>

				<UI.Row mt="24">
					<UI.Text>Don't have an account?</UI.Text>
					<Link data-variant="link" data-ml="6" className="c-text" to="/register">
						Create now
					</Link>
				</UI.Row>
				<Link data-mt="6" data-variant="link" className="c-text" to="/forgot-password">
					Forgot password?
				</Link>

				<Async.IfRejected state={loginRequestState}>
					<UI.ErrorBanner mt="24" p="6">
						{errorMessage}
					</UI.ErrorBanner>
				</Async.IfRejected>
			</UI.Column>
		</UI.Card>
	);
};
