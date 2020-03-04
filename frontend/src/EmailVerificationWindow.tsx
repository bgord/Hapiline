import {useParams, Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {Row, Text} from "./ui";
import {api} from "./services/api";

export const EmailVerificationWindow = () => {
	const {token} = useParams();

	const emailVerificationRequestState = Async.useAsync({
		promiseFn: api.auth.verifyEmail,
		token,
	});

	return (
		<>
			<Async.IfPending state={emailVerificationRequestState}>Verifying...</Async.IfPending>
			<Async.IfFulfilled state={emailVerificationRequestState}>
				<Row>
					<Text>Success! You can </Text>
					<Link className="link mx-1 text-base" to="/login">
						login
					</Link>{" "}
					<Text>now.</Text>
				</Row>
			</Async.IfFulfilled>
			<Async.IfRejected state={emailVerificationRequestState}>
				Invalid or expired token.
			</Async.IfRejected>
		</>
	);
};
