import {useHistory, Link} from "react-router-dom";
import {useMutation} from "react-query";
import React from "react";

import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useUserProfile} from "./contexts/auth-context";
import {UserProfile, LoginPayload} from "./interfaces/index";
import * as UI from "./ui";

export const LoginWindow: React.FC = () => {
	const history = useHistory();

	const [, setUserProfile] = useUserProfile();

	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	const [login, loginRequestState] = useMutation<UserProfile, LoginPayload>(api.auth.login, {
		onSuccess: userProfile => {
			if (setUserProfile) {
				setUserProfile(userProfile);
			}
			history.push("/dashboard");
		},
	});

	const {errorMessage} = getRequestStateErrors(loginRequestState);

	return (
		<UI.Card py="48" px="24" mx="auto" mt="72" style={{width: "600px"}}>
			<UI.Column
				as="form"
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					login({email, password});
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
						disabled={loginRequestState.status === "loading"}
						data-testid="login-submit"
						style={{width: "125px"}}
					>
						{loginRequestState.status === "loading" ? "Loading..." : "Login"}
					</UI.Button>
				</UI.Row>

				<UI.Row mt="24">
					<UI.Text>Don't have an account?</UI.Text>
					<UI.Text variant="link" ml="6" as={Link} to="/register">
						Create now
					</UI.Text>
				</UI.Row>

				<UI.Text mt="6" variant="link" as={Link} to="/forgot-password">
					Forgot password?
				</UI.Text>

				<UI.ShowIf request={loginRequestState} is="error">
					<UI.ErrorBanner mt="24">{errorMessage}</UI.ErrorBanner>
				</UI.ShowIf>
			</UI.Column>
		</UI.Card>
	);
};
