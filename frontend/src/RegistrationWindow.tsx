import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {
	Button,
	Card,
	Column,
	Header,
	Field,
	Input,
	Label,
	Row,
	Text,
	Error,
	ErrorBanner,
	Banner,
} from "./ui";
import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";

export const RegistrationWindow: React.FC = () => {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [passwordConfirmation, setPasswordConfirmation] = React.useState("");

	const registrationRequestState = Async.useAsync({
		deferFn: api.auth.register,
	});
	const {responseStatus, errorMessage, getArgErrorMessage} = getRequestStateErrors(
		registrationRequestState,
	);
	const emailInlineErrorMessage = getArgErrorMessage("email");

	return (
		<Card py="48" px="24" mx="auto" mt="72">
			<form
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					registrationRequestState.run(email, password, passwordConfirmation);
				}}
			>
				<Column>
					<Header>Register</Header>
					<Field mt="48">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							value={email}
							onChange={event => setEmail(event.target.value)}
							required
							type="email"
							disabled={registrationRequestState.isFulfilled}
							placeholder="john.brown@gmail.com"
							style={{width: "500px"}}
						/>
						<Async.IfRejected state={registrationRequestState}>
							<Error>{emailInlineErrorMessage}</Error>
						</Async.IfRejected>
					</Field>
					<Field mt="12">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							placeholder="********"
							title="Password should contain at least 6 characters."
							value={password}
							onChange={event => setPassword(event.target.value)}
							type="password"
							required
							pattern=".{6,}"
							disabled={registrationRequestState.isFulfilled}
						/>
					</Field>
					<Field mt="12">
						<Label htmlFor="password_confirmation">Repeat password</Label>
						<Input
							id="password_confirmation"
							type="password"
							placeholder="********"
							pattern={password}
							required
							title="Passwords have to be equal"
							value={passwordConfirmation}
							onChange={event => setPasswordConfirmation(event.target.value)}
							disabled={registrationRequestState.isFulfilled}
						/>
					</Field>
					<Row mt="24" mainAxis="end">
						<Button
							data-testid="registration-submit"
							type="submit"
							variant="primary"
							disabled={registrationRequestState.isFulfilled}
							style={{width: "125px"}}
						>
							{registrationRequestState.isPending ? "Loading..." : "Register"}
						</Button>
					</Row>
					<Async.IfFulfilled state={registrationRequestState}>
						<Banner p="12" mt="24" variant="success">
							<Column>
								<Text>Account confirmation email has been sent!</Text>
								<Row mt="12">
									<Text>You can</Text>
									<Link data-ml="6" data-variant="link" className="c-text" to="/login">
										login now
									</Link>
								</Row>
							</Column>
						</Banner>
					</Async.IfFulfilled>
					<Async.IfRejected state={registrationRequestState}>
						<ErrorBanner>{responseStatus === 500 && errorMessage}</ErrorBanner>
					</Async.IfRejected>
				</Column>
			</form>
		</Card>
	);
};
