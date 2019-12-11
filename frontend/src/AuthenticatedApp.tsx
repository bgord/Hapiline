import {Router, Route, Switch, Redirect, NavLink} from "react-router-dom";
import * as React from "react";

import {createBrowserHistory} from "history";

import {Dashboard} from "./DashboardWindow";
import {Logo} from "./Logo";
import {Logout} from "./Logout";
import {useNotificationState} from "./contexts/notifications-context";
import {useUserProfile} from "./contexts/auth-context";

const authenticatedAppBrowserHistory = createBrowserHistory();

function AuthenticatedApp() {
	return (
		<Router history={authenticatedAppBrowserHistory}>
			<AuthenticatedNavbar />
			<Notifications />
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
			<h3 className="font-semibold mr-4 p-4">{profile?.email}</h3>
			<NavLink className="p-4" activeClassName="text-blue-400" to="/logout">
				Logout
			</NavLink>
		</nav>
	);
}

import Alert from "@reach/alert";

function Notifications() {
	const notifications = useNotificationState();

	const typeToBgColor = {
		success: "green",
		info: "blue",
		error: "red",
	};

	return (
		<div className="fixed bottom-0 right-0 m-2">
			{notifications.map(notification => (
				<Alert
					style={{
						minWidth: "350px",
					}}
					className={`flex justify-between bg-${
						typeToBgColor[notification.type]
					}-300 p-4 mt-4`}
					key={notification.id}
				>
					{notification.message}
				</Alert>
			))}
		</div>
	);
}
