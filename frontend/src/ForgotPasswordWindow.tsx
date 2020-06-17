import {useMutation} from "react-query";
import React from "react";

import * as UI from "./ui";
import {api} from "./services/api";
import {User} from "./models";

export const ForgotPasswordWindow: React.FC = () => {
	const [email, setEmail] = React.useState<User["email"]>("");

	const [forgotPassword, forgotPasswordRequestState] = useMutation<unknown, User["email"]>(
		api.auth.forgotPassword,
		{onSuccess: resetEmailField},
	);

	function resetEmailField() {
		setEmail("");
	}

	return (
		<UI.Card
			py="48"
			px="24"
			mt={["72", "24"]}
			mx={["auto", "12"]}
			mb="72"
			width={["view-m", "auto"]}
		>
			<UI.Column
				as="form"
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					forgotPassword(email);
				}}
			>
				<UI.Header>Forgot password</UI.Header>

				<UI.Field mt="48">
					<UI.Label htmlFor="email">Email</UI.Label>
					<UI.Input
						type="email"
						id="email"
						value={email}
						required
						onChange={event => setEmail(event.target.value)}
						placeholder="john.brown@gmail.com"
					/>
				</UI.Field>

				<UI.Row mt="24" mainAxis="end">
					<UI.Button
						variant="primary"
						type="submit"
						disabled={forgotPasswordRequestState.status === "loading"}
						style={{width: "125px"}}
					>
						{forgotPasswordRequestState.status === "loading" ? "Loading..." : "Send email"}
					</UI.Button>
				</UI.Row>

				<UI.ShowIf request={forgotPasswordRequestState} is={["idle", "loading", "error"]}>
					<UI.InfoBanner mt="48">
						You will receive an email with further instructions.
					</UI.InfoBanner>
				</UI.ShowIf>

				<UI.ShowIf request={forgotPasswordRequestState} is="success">
					<UI.SuccessBanner mt="48">Email sent if an account exists.</UI.SuccessBanner>
				</UI.ShowIf>
			</UI.Column>
		</UI.Card>
	);
};
