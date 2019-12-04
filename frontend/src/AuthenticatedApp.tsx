import {Router, Route, Switch, Redirect, NavLink} from "react-router-dom";
import * as React from "react";

import {createBrowserHistory} from "history";

import {Dashboard} from "./DashboardWindow";
import {Logo} from "./Logo";
import {Logout} from "./Logout";
import {useUserProfile} from "./contexts/auth-context";

const authenticatedAppBrowserHistory = createBrowserHistory();

function AuthenticatedApp() {
	return (
		<Router history={authenticatedAppBrowserHistory}>
			<AuthenticatedNavbar />
			<Switch>
				<Route exact path="/logout">
					<Logout />
				</Route>
				<Route exact path="/dashboard">
					<Dashboard />
				</Route>
				<Redirect to="/dashboard" />
			</Switch>
		</Router>
	);
}

export default AuthenticatedApp;

function AuthenticatedNavbar() {
	const [profile] = useUserProfile();
	const email = profile?.email;
	return (
		<nav className="flex justify-end py-1 bg-white shadow-md">
			<NavLink
				className="ml-2 mr-auto p-2"
				exact
				activeClassName="text-blue-400"
				to="/dashboard"
			>
				<Logo />
			</NavLink>
			<h3 className="font-semibold mr-4 p-4">{email}</h3>
			<NavLink className="p-4" activeClassName="text-blue-400" to="/logout">
				Logout
			</NavLink>
		</nav>
	);
}
