import {useQuery} from "react-query";
import React from "react";

import * as UI from "../ui";
import {UserProfile} from "../models";
import {api} from "../services/api";

type UserProfileContext = [
	UserProfile | null,
	React.Dispatch<React.SetStateAction<UserProfile | null>>?,
];

const AuthContext = React.createContext<UserProfileContext>([null]);

export const AuthProvider: React.FC = props => {
	const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
	const [firstAttemptFinished, setFirstAttemptFinished] = React.useState(false);

	const isLoggedInRequest = useQuery<UserProfile, "is_logged_in">({
		queryKey: "is_logged_in",
		queryFn: api.auth.isLoggedIn,
		config: {
			retry: false,
			refetchOnWindowFocus: false,
		},
	});

	React.useLayoutEffect(() => {
		if (["success", "error"].includes(isLoggedInRequest.status)) {
			setFirstAttemptFinished(true);
			setUserProfile(isLoggedInRequest.data ?? null);
		}
	}, [isLoggedInRequest.status, isLoggedInRequest.data]);

	if (!firstAttemptFinished && isLoggedInRequest.status === "loading") {
		return <UI.Loader />;
	}

	if (!firstAttemptFinished && isLoggedInRequest.status === "error") {
		return <div>Something went wrong</div>;
	}

	return <AuthContext.Provider value={[userProfile, setUserProfile]} {...props} />;
};

export function useUserProfile() {
	const context = React.useContext(AuthContext);
	if (context === undefined) {
		throw new Error(`useUser must be used within the AuthProvider`);
	}
	return context;
}

export function useIsLoggedIn() {
	const context = React.useContext(AuthContext);
	if (context === undefined) {
		throw new Error(`useIsLoggedIn must be used within the AuthProvider`);
	}
	return context[0] !== null;
}
