import * as Async from "react-async";
import React from "react";

import {Loader} from "../Loader";
import {api} from "../services/api";

export interface UserProfileInterface {
	email: string;
	id: string;
}

type UserProfileContext = [
	UserProfileInterface | null,
	React.Dispatch<React.SetStateAction<UserProfileInterface | null>>?,
];

const AuthContext = React.createContext<UserProfileContext>([null]);

export const AuthProvider: React.FC = props => {
	const [
		userProfile,
		setUserProfile,
	] = React.useState<UserProfileInterface | null>(null);
	const [firstAttemptFinished, setFirstAttemptFinished] = React.useState<
		boolean
	>(false);

	const {isSettled, data, isPending, isRejected} = Async.useAsync({
		promiseFn: api.auth.isLoggedIn,
	});

	React.useLayoutEffect(() => {
		if (isSettled) {
			setFirstAttemptFinished(true);
			setUserProfile(data || null);
		}
	}, [isSettled]);

	if (!firstAttemptFinished && isPending) {
		return <Loader />;
	}

	if (!firstAttemptFinished && isRejected) {
		return <div>Something went wrong</div>;
	}

	return (
		<AuthContext.Provider value={[userProfile, setUserProfile]} {...props} />
	);
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
