import {useParams, Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import * as UI from "./ui";
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
				<UI.Text mt="24" ml="12">
					Verifying...
				</UI.Text>
			</Async.IfPending>

			<Async.IfFulfilled state={emailVerificationRequestState}>
				<UI.Row mt="48" width="100%" mainAxis="center">
					<UI.Banner variant="success" size="big">
						<UI.Text>Success! You can </UI.Text>
						<Link data-mx="3" data-variant="link" className="c-text" to="/login">
							login
						</Link>
						<UI.Text> now.</UI.Text>
					</UI.Banner>
				</UI.Row>
			</Async.IfFulfilled>

			<Async.IfRejected state={emailVerificationRequestState}>
				<UI.Row mainAxis="center" width="100%">
					<UI.ErrorBanner mt="48" size="big">
						Invalid or expired token
					</UI.ErrorBanner>
				</UI.Row>
			</Async.IfRejected>
		</>
	);
};
