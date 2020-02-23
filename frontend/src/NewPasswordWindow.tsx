import {useParams, Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {Button} from "./ui/button/Button";
import {Card} from "./ui/card/Card";
import {Column} from "./ui/column/Column";
import {Field} from "./ui/field/Field";
import {Header} from "./ui/header/Header";
import {Input} from "./ui/input/Input";
import {Label} from "./ui/label/Label";
import {RequestErrorMessage} from "./ErrorMessages";
import {Row} from "./ui/row/Row";
import {Text} from "./ui/text/Text";
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
		<Card pt="48" pb="48" pr="24" pl="24" ml="auto" mr="auto" mt="72">
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
						<Text>Password has been changed!</Text>
						<Row mt="12">
							<span className="text-sm">You can </span>
							<Link className="link ml-1" to="/login">
								login now
							</Link>
						</Row>
					</Async.IfFulfilled>
					<Async.IfRejected state={newPasswordRequestState}>
						<RequestErrorMessage>{errorMessage}</RequestErrorMessage>
					</Async.IfRejected>
				</Column>
			</form>
		</Card>
	);
};
