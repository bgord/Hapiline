import {useHistory, Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {RequestErrorMessage} from "./ErrorMessages";
import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useUserProfile} from "./contexts/auth-context";
import {Button} from "./ui/button/Button";
import {Field} from "./ui/field/Field";
import {Input} from "./ui/input/Input";
import {Label} from "./ui/label/Label";

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
				<Field style={{width: "100%"}}>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						value={email}
						onChange={event => setEmail(event.target.value)}
						required
						type="email"
						placeholder="john.brown@gmail.com"
					/>
				</Field>
				<Field style={{width: "100%", marginTop: "12px"}}>
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
				<div className="flex justify-end w-full mt-6">
					<Button
						type="submit"
						variant="secondary"
						disabled={loginRequestState.isPending}
						data-testid="login-submit"
						style={{width: "125px"}}
					>
						{loginRequestState.isPending ? "Loading..." : "Login"}
					</Button>
				</div>
				<div className="flex mt-8">
					<span className="text-sm">Don't have an account?</span>
					<Link className="link ml-1" to="/register">
						Create now
					</Link>
				</div>
				<Link className="link mt-2" to="/forgot-password">
					Forgot password?
				</Link>
				<Async.IfRejected state={loginRequestState}>
					<RequestErrorMessage>{errorMessage}</RequestErrorMessage>
				</Async.IfRejected>
			</form>
		</div>
	);
};
