import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {RequestErrorMessage} from "./ErrorMessages";
import {api} from "./services/api";
import {useErrorNotification} from "./contexts/notifications-context";

export const ProfileWindow = () => {
	const triggerErrorNotification = useErrorNotification();
	const history = useHistory();

	const deleteAccountRequestState = Async.useAsync({
		deferFn: api.auth.deleteAccount,
		onResolve: () => history.push("/logout"),
		onReject: () => triggerErrorNotification("Couldn't delete account."),
	});

	return (
		<section className="flex flex-col max-w-2xl mx-auto mt-12">
			<strong>Profile</strong>
			<button
				className="mt-10 bg-red-500 w-32 text-white"
				disabled={deleteAccountRequestState.isPending}
				onClick={deleteAccountRequestState.run}
			>
				Delete account
			</button>
			<Async.IfRejected state={deleteAccountRequestState}>
				<RequestErrorMessage>An error occurred during account deletion.</RequestErrorMessage>
			</Async.IfRejected>
		</section>
	);
};
