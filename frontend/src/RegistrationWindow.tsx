import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import * as UI from "./ui";
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
		<UI.Card py="48" px="24" mx="auto" mt="72">
			<UI.Column
				as="form"
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					registrationRequestState.run(email, password, passwordConfirmation);
				}}
			>
				<UI.Header>Register</UI.Header>

				<UI.Field mt="48">
					<UI.Label htmlFor="email">Email</UI.Label>
					<UI.Input
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
						<UI.Error>{emailInlineErrorMessage}</UI.Error>
					</Async.IfRejected>
				</UI.Field>

				<UI.Field mt="12">
					<UI.Label htmlFor="password">Password</UI.Label>
					<UI.Input
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
				</UI.Field>

				<UI.Field mt="12">
					<UI.Label htmlFor="password_confirmation">Repeat password</UI.Label>
					<UI.Input
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
				</UI.Field>

				<UI.Row mt="24" mainAxis="end">
					<UI.Button
						data-testid="registration-submit"
						type="submit"
						variant="primary"
						disabled={registrationRequestState.isFulfilled}
						style={{width: "125px"}}
					>
						{registrationRequestState.isPending ? "Loading..." : "Register"}
					</UI.Button>
				</UI.Row>

				<Async.IfFulfilled state={registrationRequestState}>
					<UI.Banner p="12" mt="24" variant="success">
						<UI.Column>
							<UI.Text>Account confirmation email has been sent!</UI.Text>
							<UI.Row mt="12">
								<UI.Text>You can</UI.Text>
								<Link data-ml="6" data-variant="link" className="c-text" to="/login">
									login now
								</Link>
							</UI.Row>
						</UI.Column>
					</UI.Banner>
				</Async.IfFulfilled>

				<Async.IfRejected state={registrationRequestState}>
					{responseStatus === 500 && errorMessage && (
						<UI.ErrorBanner mt="24" p="6">
							{errorMessage}
						</UI.ErrorBanner>
					)}
				</Async.IfRejected>
			</UI.Column>
		</UI.Card>
	);
};
