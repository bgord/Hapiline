import {useParams, Link} from "react-router-dom";
import {useMutation} from "react-query";
import React from "react";

import {Token} from "./interfaces/index";
import * as UI from "./ui";
import {api} from "./services/api";

export const EmailVerificationWindow = () => {
	const {token} = useParams();

	const [verifyEmail, emailVerificationRequestState] = useMutation<unknown, Token>(
		api.auth.verifyEmail,
	);

	// Execute only on the first mount, and ignore all token changes
	// as it shouldn't be updated manually via URL.
	React.useEffect(() => {
		verifyEmail(token ?? "");
	}, [verifyEmail, token]);

	return (
		<>
			{emailVerificationRequestState.status === "loading" && (
				<UI.Text mt="24" ml="12">
					Verifying...
				</UI.Text>
			)}

			{emailVerificationRequestState.status === "success" && (
				<UI.Row mt="48" width="100%" mainAxis="center">
					<UI.SuccessBanner size="big">
						<UI.Text ml="12">Success! You can </UI.Text>
						<Link data-mx="3" data-variant="link" className="c-text" to="/login">
							login
						</Link>
						<UI.Text> now.</UI.Text>
					</UI.SuccessBanner>
				</UI.Row>
			)}

			{emailVerificationRequestState.status === "error" && (
				<UI.Row mainAxis="center" width="100%">
					<UI.ErrorBanner mt="48" size="big">
						Invalid or expired token
					</UI.ErrorBanner>
				</UI.Row>
			)}
		</>
	);
};
