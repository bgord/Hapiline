import {useHistory, Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {RequestErrorMessage} from "./ErrorMessages";
import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useUserProfile} from "./contexts/auth-context";

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
		<div className="bg-white rounded shadow-lg p-8 sm:max-w-sm sm:mx-auto">
			<form
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					loginRequestState.run(email, password);
				}}
				className="sm:flex sm:flex-wrap sm:justify-between"
			>
				<div className="field-group mb-4 sm:w-full">
					<label className="field-label" htmlFor="email">
						Email
					</label>
					<input
						required
						value={email}
						onChange={event => setEmail(event.target.value)}
						className="field"
						type="email"
						name="email"
						id="email"
						placeholder="john.brown@gmail.com"
					/>
				</div>
				<div className="field-group mb-6 sm:w-full">
					<label className="field-label" htmlFor="password">
						Password
					</label>
					<input
						required
						pattern=".{6,}"
						title="Password should contain at least 6 characters."
						value={password}
						onChange={event => setPassword(event.target.value)}
						className="field"
						type="password"
						name="password"
						id="password"
						placeholder="********"
					/>
				</div>
				<div className="flex">
					<span className="text-sm">Don't have an account?</span>
					<Link className="link ml-1" to="/register">
						Create now
					</Link>
				</div>
				<Link className="link mt-2" to="/forgot-password">
					Forgot password?
				</Link>
				<div className="flex justify-end w-full mt-6">
					<button
						className="btn btn-blue"
						type="submit"
						disabled={loginRequestState.isPending}
						data-testid="login-submit"
					>
						{loginRequestState.isPending ? "Loading..." : "Login"}
					</button>
				</div>
				<Async.IfRejected state={loginRequestState}>
					<RequestErrorMessage>{errorMessage}</RequestErrorMessage>
				</Async.IfRejected>
			</form>
		</div>
	);
};
