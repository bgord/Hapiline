import {useParams, Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {api} from "./services/api";

export const EmailVerificationWindow = () => {
	const {token} = useParams();

	const emailVerificationRequestState = Async.useAsync({
		promiseFn: api.auth.verifyEmail,
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
