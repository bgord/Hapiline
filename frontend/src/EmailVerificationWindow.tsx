import * as Async from "react-async";
import {useParams, Link} from "react-router-dom";
import React from "react";

import {api} from "./services/api";

const performEmailVerificationRequest: Async.PromiseFn<void> = async ({
	token,
}) => api.post("/verify-email", {token: decodeURIComponent(token)});

export const EmailVerificationWindow = () => {
	const {token} = useParams();

	const emailVerificationRequestState = Async.useAsync({
		promiseFn: performEmailVerificationRequest,
		token,
	});

	return (
		<>
			<Async.IfPending state={emailVerificationRequestState}>
				Verifying...
			</Async.IfPending>
			<Async.IfFulfilled state={emailVerificationRequestState}>
				<div className="flex">
					<span>Success! You can </span>
					<Link className="link mx-1 text-base" to="/login">
						login
					</Link>{" "}
					<span>now.</span>
				</div>
			</Async.IfFulfilled>
			<Async.IfRejected state={emailVerificationRequestState}>
				Invalid or expired token.
			</Async.IfRejected>
		</>
	);
};
