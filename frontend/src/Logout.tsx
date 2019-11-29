import {useAsync, PromiseFn} from "react-async";
import {useHistory} from "react-router-dom";
import React from "react";

import {api} from "./services/api";
import {useUserProfile} from "./contexts/auth-context";

const performLogoutRequest: PromiseFn<void> = async ({
	history,
	setUserProfile,
}) => {
	await api.post("/logout");
	setUserProfile(null);
	history.push("/");
};

export const Logout: React.FC = () => {
	const history = useHistory();
	const [, setUserProfile] = useUserProfile();
	useAsync({promiseFn: performLogoutRequest, history, setUserProfile});
	return <div>Logging out...</div>;
};
