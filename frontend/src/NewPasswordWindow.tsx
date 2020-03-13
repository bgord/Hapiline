import {useParams, Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {
	Button,
	Card,
	Column,
	Header,
	Field,
	Label,
	Input,
	Row,
	Text,
	ErrorBanner,
	Banner,
} from "./ui";
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
		<Card py="48" px="24" mx="auto" mt="72">
			<form
				onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					newPasswordRequestState.run(token, password, passwordConfirmation);
				}}
			>
				<Column>
					<Header>New password</Header>

					<Field mt="48">
						<Label htmlFor="password">Password</Label>
						<Input
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
							style={{width: "500px"}}
						/>
					</Field>

					<Field mt="12">
						<Label htmlFor="password_confirmation">Repeat password</Label>
						<Input
							id="password_confirmation"
							type="password"
							placeholder="********"
							pattern={password}
							title="Passwords have to be equal"
							value={passwordConfirmation}
							onChange={event => setPasswordConfirmation(event.target.value)}
							required
							disabled={newPasswordRequestState.isFulfilled}
						/>
					</Field>

					<Row mainAxis="end" mt="24">
						<Button
							variant="primary"
							type="submit"
							disabled={newPasswordRequestState.isFulfilled}
							data-testid="registration-submit"
						>
							{newPasswordRequestState.isPending ? "Loading..." : "Change password"}
						</Button>
					</Row>

					<Async.IfFulfilled state={newPasswordRequestState}>
						<Banner mt="24" variant="success" p="6">
							<Column>
								<Text>Password has been changed!</Text>
								<Row mt="6">
									<Text>You can</Text>
									<Link data-ml="6" data-variant="link" className="c-text" to="/login">
										login now
									</Link>
								</Row>
							</Column>
						</Banner>
					</Async.IfFulfilled>

					<Async.IfRejected state={newPasswordRequestState}>
						<ErrorBanner mt="24" p="6">
							{errorMessage}
						</ErrorBanner>
					</Async.IfRejected>
				</Column>
			</form>
		</Card>
	);
};
