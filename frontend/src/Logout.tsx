import {useHistory} from "react-router-dom";
import {useMutation} from "react-query";
import React from "react";

import * as UI from "./ui";
import {api} from "./services/api";
import {useUserProfile} from "./contexts/auth-context";

export const Logout: React.FC = () => {
	const history = useHistory();
	const [, setUserProfile] = useUserProfile();

	const [logout] = useMutation(api.auth.logout, {
		onSettled: () => {
			setUserProfile?.(null);
			history.push("/");
		},
	});

	React.useEffect(() => {
		logout();
	}, []);

	return <UI.Text>Logging out</UI.Text>;
};
