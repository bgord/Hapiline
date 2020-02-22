import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {Button} from "./ui/button/Button";
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
		<div className="bg-white rounded shadow-lg p-8 md:max-w-sm md:mx-auto ">
			<form
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					registrationRequestState.run(email, password, passwordConfirmation);
				}}
				className="mb-4 md:flex md:flex-wrap md:justify-between"
			>
				<Header>Register</Header>
				<Field mt="48" style={{width: "100%"}}>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						value={email}
						onChange={event => setEmail(event.target.value)}
						required
						type="email"
						disabled={registrationRequestState.isFulfilled}
						placeholder="john.brown@gmail.com"
					/>
					<Async.IfRejected state={registrationRequestState}>
						<ErrorMessage>{emailInlineErrorMessage}</ErrorMessage>
					</Async.IfRejected>
				</Field>
				<Field mt="12" style={{width: "100%"}}>
					<Label htmlFor="Password">Password</Label>
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
				<Field mt="12" style={{width: "100%"}}>
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
				<Row mainAxis="end" style={{marginTop: "24px"}}>
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
					<Row style={{marginTop: "18px"}}>
						<span className="text-sm">You can </span>
						<Link className="link ml-1" to="/login">
							login now
						</Link>
					</Row>
				</Async.IfFulfilled>
				<Async.IfRejected state={registrationRequestState}>
					<RequestErrorMessage>{responseStatus === 500 && errorMessage}</RequestErrorMessage>
				</Async.IfRejected>
			</form>
		</div>
	);
};
