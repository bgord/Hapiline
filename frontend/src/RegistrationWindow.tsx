import {useMutation} from "react-query";
import React from "react";

import * as UI from "./ui";
import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {User, NewUserPayload} from "./interfaces/index";

export const RegistrationWindow: React.FC = () => {
	const [email, setEmail] = React.useState<User["email"]>("");
	const [password, setPassword] = React.useState<User["password"]>("");
	const [passwordConfirmation, setPasswordConfirmation] = React.useState<User["password"]>("");

	const [register, registrationRequestState] = useMutation<unknown, NewUserPayload>(
		api.auth.register,
	);

	const {responseStatus, errorMessage, getArgErrorMessage} = getRequestStateErrors(
		registrationRequestState,
	);
	const emailInlineErrorMessage = getArgErrorMessage("email");

	return (
		<UI.Card py="48" px="24" mx="auto" mt="72" style={{width: "600px"}}>
			<UI.Column
				as="form"
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					register({email, password, password_confirmation: passwordConfirmation});
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
						disabled={registrationRequestState.status === "success"}
						placeholder="john.brown@gmail.com"
					/>
					<UI.ShowIf request={registrationRequestState} is="error">
						<UI.Error>{emailInlineErrorMessage}</UI.Error>
					</UI.ShowIf>
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
						disabled={registrationRequestState.status === "success"}
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
						disabled={registrationRequestState.status === "success"}
					/>
				</UI.Field>

				<UI.Row mt="24" mainAxis="end">
					<UI.Button
						data-testid="registration-submit"
						type="submit"
						variant="primary"
						disabled={["success", "loading"].includes(registrationRequestState.status)}
						style={{width: "125px"}}
					>
						{registrationRequestState.status === "loading" ? "Loading..." : "Register"}
					</UI.Button>
				</UI.Row>

				<UI.ShowIf request={registrationRequestState} is="success">
					<UI.SuccessBanner size="big" mt="24">
						<UI.Column ml="12">
							<UI.Text>Account confirmation email has been sent!</UI.Text>
							<UI.Text>Please, check your inbox.</UI.Text>
						</UI.Column>
					</UI.SuccessBanner>
				</UI.ShowIf>

				<UI.ShowIf request={registrationRequestState} is="error">
					<UI.ErrorBanner mt="24">
						{responseStatus === 500 && errorMessage && errorMessage}
					</UI.ErrorBanner>
				</UI.ShowIf>

				<UI.ShowIf request={registrationRequestState} is="success">
					<UI.InfoBanner mt="48">
						<UI.Text>
							You will receive an account confirmation email with further instructions.
						</UI.Text>
					</UI.InfoBanner>
				</UI.ShowIf>
			</UI.Column>
		</UI.Card>
	);
};
