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
						<UI.Text ml="12">Success! You can </UI.Text>
						<Link data-mx="3" data-variant="link" className="c-text" to="/login">
							login
						</Link>
						<UI.Text> now.</UI.Text>
					</UI.SuccessBanner>
				</UI.Row>
			</UI.ShowIf>

			<UI.ShowIf request={emailVerificationRequestState} is="error">
				<UI.Row mainAxis="center" width="100%">
					<UI.ErrorBanner mt="48" size="big">
						Invalid or expired token
					</UI.ErrorBanner>
				</UI.Row>
			</UI.ShowIf>
		</>
	);
};
