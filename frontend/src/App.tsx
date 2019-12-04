import React from "react";

import {Loader} from "./Loader";
import {useIsLoggedIn} from "./contexts/auth-context";

const AuthenticatedApp = React.lazy(() =>
	import(/* webpackChunkName: "authenticated-app" */ "./AuthenticatedApp"),
);
const UnauthenticatedApp = React.lazy(() =>
	import(/* webpackChunkName: "unauthenticated-app" */ "./UnauthenticatedApp"),
);

export function App() {
	const isLoggedIn = useIsLoggedIn();
	return (
		<React.Suspense fallback={<Loader />}>
			{isLoggedIn ? <AuthenticatedApp /> : <UnauthenticatedApp />}
		</React.Suspense>
	);
}
