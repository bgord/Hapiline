import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {Button} from "./ui/button/Button";
import {Card} from "./ui/card/Card";
import {Column} from "./ui/column/Column";
import {ErrorMessage, RequestErrorMessage} from "./ErrorMessages";
import {Field} from "./ui/field/Field";
import {Header} from "./ui/header/Header";
import {Input} from "./ui/input/Input";
import {Label} from "./ui/label/Label";
import {Row} from "./ui/row/Row";
import {Text} from "./ui/text/Text";
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
		<Card pt="48" pb="48" pr="24" pl="24" ml="auto" mr="auto" mt="72">
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
							<ErrorMessage>{emailInlineErrorMessage}</ErrorMessage>
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
						<Text>Account confirmation email has been sent!</Text>
						<Row mt="24">
							<span className="text-sm">You can </span>
							<Link className="link ml-1" to="/login">
								login now
							</Link>
						</Row>
					</Async.IfFulfilled>
					<Async.IfRejected state={registrationRequestState}>
						<RequestErrorMessage>{responseStatus === 500 && errorMessage}</RequestErrorMessage>
					</Async.IfRejected>
				</Column>
			</form>
		</Card>
	);
};
