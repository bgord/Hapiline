import {useParams, Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {Button} from "./ui/button/Button";
import {RequestErrorMessage} from "./ErrorMessages";
import {SuccessMessage} from "./SuccessMessages";
import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";

export const NewPasswordWindow: React.FC = () => {
	const {token} = useParams();
	const [password, setPassword] = React.useState("");
	const [passwordConfirmation, setPasswordConfirmation] = React.useState("");

	const newPasswordRequestState = Async.useAsync({
		deferFn: api.auth.newPassword,
	});
	const {errorMessage} = getRequestStateErrors(newPasswordRequestState);

	return (
		<div className="bg-white rounded shadow-lg p-8 md:max-w-sm md:mx-auto ">
			<form
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					newPasswordRequestState.run(token, password, passwordConfirmation);
				}}
				className="mb-4 md:flex md:flex-wrap md:justify-between"
			>
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
						disabled={newPasswordRequestState.isFulfilled}
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
						disabled={newPasswordRequestState.isFulfilled}
					/>
				</div>
				<div className="flex justify-end w-full">
					<Button
						variant="secondary"
						type="submit"
						disabled={newPasswordRequestState.isFulfilled}
						data-testid="registration-submit"
					>
						{newPasswordRequestState.isPending ? "Loading..." : "Change password"}
					</Button>
				</div>
				<Async.IfFulfilled state={newPasswordRequestState}>
					<SuccessMessage>Password has been changed!</SuccessMessage>
					<div className="flex mt-4">
						<span className="text-sm">You can </span>
						<Link className="link ml-1" to="/login">
							login now
						</Link>
					</div>
				</Async.IfFulfilled>
				<Async.IfRejected state={newPasswordRequestState}>
					<RequestErrorMessage>{errorMessage}</RequestErrorMessage>
				</Async.IfRejected>
			</form>
		</div>
	);
};
