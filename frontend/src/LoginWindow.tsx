import {useHistory, Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {RequestErrorMessage} from "./ErrorMessages";
import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useUserProfile} from "./contexts/auth-context";
import {Header} from "./ui/header/Header";
import {Button} from "./ui/button/Button";
import {Card} from "./ui/card/Card";
import {Column} from "./ui/column/Column";
import {Field} from "./ui/field/Field";
import {Input} from "./ui/input/Input";
import {Label} from "./ui/label/Label";
import {Text} from "./ui/text/Text";
import {Row} from "./ui/row/Row";

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
		<Card pt="48" pb="48" pr="24" pl="24" ml="auto" mr="auto" mt="72">
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
						<Link className="link ml-1" to="/register">
							Create now
						</Link>
					</Row>
					<Link className="link" to="/forgot-password">
						Forgot password?
					</Link>
					<Async.IfRejected state={loginRequestState}>
						<RequestErrorMessage>{errorMessage}</RequestErrorMessage>
					</Async.IfRejected>
				</Column>
			</form>
		</Card>
	);
};
