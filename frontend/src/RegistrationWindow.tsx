import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {Button} from "./ui/button/Button";
import {ErrorMessage, RequestErrorMessage} from "./ErrorMessages";
import {SuccessMessage} from "./SuccessMessages";
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
				<div className="field-group mb-4 md:w-full">
					<label className="field-label" htmlFor="email">
						Email
					</label>
					<input
						className="field"
						name="email"
						id="email"
						placeholder="john.brown@gmail.com"
						value={email}
						onChange={event => setEmail(event.target.value)}
						required
						type="email"
						disabled={registrationRequestState.isFulfilled}
					/>
					<Async.IfRejected state={registrationRequestState}>
						<ErrorMessage>{emailInlineErrorMessage}</ErrorMessage>
					</Async.IfRejected>
				</div>
				<div className="field-group mb-6 md:w-full">
					<label className="field-label" htmlFor="password">
						Password
					</label>
					<input
						className="field"
						name="password"
						id="password"
						placeholder="********"
						autoComplete="new-password"
						title="Password should contain at least 6 characters."
						value={password}
						onChange={event => setPassword(event.target.value)}
						type="password"
						required
						pattern=".{6,}"
						disabled={registrationRequestState.isFulfilled}
					/>
				</div>
				<div className="field-group mb-6 md:w-full">
					<label className="field-label" htmlFor="password-confirmation">
						Repeat password
					</label>
					<input
						className="field"
						type="password"
						name="password-confirmation"
						id="password-confirmation"
						placeholder="********"
						pattern={password}
						title="Passwords have to be equal"
						value={passwordConfirmation}
						onChange={event => setPasswordConfirmation(event.target.value)}
						required
						disabled={registrationRequestState.isFulfilled}
					/>
				</div>
				<div className="flex justify-end w-full">
					<Button
						data-testid="registration-submit"
						type="submit"
						variant="secondary"
						disabled={registrationRequestState.isFulfilled}
						style={{width: "100px"}}
					>
						{registrationRequestState.isPending ? "Loading..." : "Register"}
					</Button>
				</div>
				<Async.IfFulfilled state={registrationRequestState}>
					<SuccessMessage>Account confirmation email has been sent!</SuccessMessage>
					<div className="flex mt-4">
						<span className="text-sm">You can </span>
						<Link className="link ml-1" to="/login">
							login now
						</Link>
					</div>
				</Async.IfFulfilled>
				<Async.IfRejected state={registrationRequestState}>
					<RequestErrorMessage>{responseStatus === 500 && errorMessage}</RequestErrorMessage>
				</Async.IfRejected>
			</form>
		</div>
	);
};
