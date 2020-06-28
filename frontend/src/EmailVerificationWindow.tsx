import {useParams, Link} from "react-router-dom";
import {useMutation} from "react-query";
import React from "react";

import {Token} from "./models";
import * as UI from "./ui";
import {api} from "./services/api";

export const EmailVerificationWindow = () => {
	const {token} = useParams();

	const [verifyEmail, emailVerificationRequestState] = useMutation<unknown, Token>(
		api.auth.verifyEmail,
	);

	React.useEffect(() => {
		verifyEmail(token ?? "");
	}, [verifyEmail, token]);

	return (
		<>
			<UI.ShowIf request={emailVerificationRequestState} is="loading">
				<UI.Text mt="24" ml="12">
					Verifying...
				</UI.Text>
			</UI.ShowIf>

			<UI.ShowIf request={emailVerificationRequestState} is="success">
				<UI.Row mt="48" width="100%" mainAxis="center">
					<UI.SuccessBanner size="big">
						<UI.Column>
							<UI.Text ml="12">Email verified successfully!</UI.Text>

							<UI.Row>
								<UI.Text ml="12">You can</UI.Text>
								<UI.Text variant="link" mx="3" as={Link} to="/login">
									login
								</UI.Text>
								<UI.Text> now.</UI.Text>
							</UI.Row>
						</UI.Column>
					</UI.SuccessBanner>
				</UI.Row>
			</UI.ShowIf>

			<UI.ShowIf request={emailVerificationRequestState} is="error">
				<UI.Row mainAxis="center" width="100%">
					<UI.ErrorBanner mt="48" size="big">
						<UI.Column>
							<UI.Text>We cannot verify your email :(</UI.Text>
							<UI.Text>Invalid or expired token.</UI.Text>
						</UI.Column>
					</UI.ErrorBanner>
				</UI.Row>
			</UI.ShowIf>
		</>
	);
};
