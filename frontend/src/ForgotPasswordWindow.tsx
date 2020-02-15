import * as Async from "react-async";
import React from "react";

import {Button} from "./ui/button/Button";
import {SuccessMessage} from "./SuccessMessages";
import {api} from "./services/api";

export const ForgotPasswordWindow: React.FC = () => {
	const [email, setEmail] = React.useState("");

	const forgotPasswordRequestState = Async.useAsync({
		deferFn: api.auth.forgotPassword,
		onResolve: () => setEmail(""),
	});

	return (
		<div className="bg-white rounded shadow-lg p-8 sm:max-w-sm sm:mx-auto">
			<form
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					forgotPasswordRequestState.run(email);
				}}
				className="sm:flex sm:flex-wrap sm:justify-between"
			>
				<div className="field-group mb-4 sm:w-full">
					<label className="field-label" htmlFor="email">
						Email
					</label>
					<input
						required
						className="field"
						type="email"
						name="email"
						id="email"
						value={email}
						onChange={event => setEmail(event.target.value)}
						placeholder="john.brown@gmail.com"
					/>
				</div>
				<div className="flex justify-end w-full mt-6">
					<Button
						variant="secondary"
						type="submit"
						disabled={forgotPasswordRequestState.isPending}
						style={{width: "125px"}}
					>
						{forgotPasswordRequestState.isPending ? "Loading..." : "Send email"}
					</Button>
				</div>
				<Async.IfFulfilled state={forgotPasswordRequestState}>
					<SuccessMessage className="w-full">Email sent if an account exists.</SuccessMessage>
				</Async.IfFulfilled>
			</form>
		</div>
	);
};
