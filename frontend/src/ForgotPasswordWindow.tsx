import * as Async from "react-async";
import React from "react";

import {Button} from "./ui/button/Button";
import {Field} from "./ui/field/Field";
import {Header} from "./ui/header/Header";
import {Input} from "./ui/input/Input";
import {Label} from "./ui/label/Label";
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
				onSubmit={event => {
					event.preventDefault();
					forgotPasswordRequestState.run(email);
				}}
				className="sm:flex sm:flex-wrap sm:justify-between"
			>
				<Header>Forgot password</Header>
				<Field style={{width: "100%", marginTop: "48px"}}>
					<Label htmlFor="email">Email</Label>
					<Input
						type="email"
						id="email"
						value={email}
						required
						onChange={event => setEmail(event.target.value)}
						placeholder="john.brown@gmail.com"
					/>
				</Field>
				<div className="flex justify-end w-full mt-6">
					<Button
						variant="primary"
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
