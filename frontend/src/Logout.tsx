import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {api} from "./services/api";
import {useUserProfile} from "./contexts/auth-context";

export const Logout: React.FC = () => {
	const history = useHistory();
	const [, setUserProfile] = useUserProfile();
	Async.useAsync({
		promiseFn: api.auth.logout,
		onResolve: () => {
			if (setUserProfile) setUserProfile(null);
			history.push("/");
		},
	});
	return <div>Logging out...</div>;
};
