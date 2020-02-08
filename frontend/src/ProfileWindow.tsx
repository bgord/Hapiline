import * as Async from "react-async";
import React from "react";
import {useHistory} from "react-router-dom";

import {api} from "./services/api";

export const ProfileWindow = () => {
	const history = useHistory();

	const deleteAccountRequestState = Async.useAsync({
		deferFn: api.auth.deleteAccount,
		onResolve: () => history.push("/logout"),
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
		</section>
	);
};
