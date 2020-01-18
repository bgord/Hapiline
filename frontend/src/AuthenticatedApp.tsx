import {Router, Route, Switch, Redirect, NavLink} from "react-router-dom";
import * as React from "react";

import {createBrowserHistory} from "history";

import {Calendar} from "./Calendar";
import {DashboardWindow} from "./DashboardWindow";
import {HabitsProvider} from "./contexts/habits-context";
import {HabitsWindow} from "./HabitsWindow";
import {Logo} from "./Logo";
import {Logout} from "./Logout";
import {Notifications} from "./Notifications";
import {useUserProfile} from "./contexts/auth-context";

const authenticatedAppBrowserHistory = createBrowserHistory();

function AuthenticatedApp() {
	return (
		<HabitsProvider>
			<Router history={authenticatedAppBrowserHistory}>
				<AuthenticatedNavbar />
				<Notifications />
				<Switch>
					<Route exact path="/logout">
						<Logout />
					</Route>
					<Route exact path="/habits">
						<HabitsWindow />
					</Route>
					<Route exact path="/calendar">
						<Calendar />
					</Route>
					<Route exact path="/dashboard">
						<DashboardWindow />
					</Route>
					<Redirect to="/dashboard" />
				</Switch>
			</Router>
		</HabitsProvider>
	);
}

export default AuthenticatedApp;

function AuthenticatedNavbar() {
	const [profile] = useUserProfile();
	return (
		<nav className="flex justify-end py-1 bg-white shadow-md">
			<NavLink className="ml-2 mr-auto p-2" exact activeClassName="text-blue-400" to="/dashboard">
				<Logo />
			</NavLink>
			<NavLink exact className="p-4" activeClassName="text-blue-400" to="/dashboard">
				Dashboard
			</NavLink>
			<NavLink exact className="p-4" activeClassName="text-blue-400" to="/habits">
				Habits
			</NavLink>
			<NavLink className="p-4" activeClassName="text-blue-400" to="/calendar">
				Calendar
			</NavLink>
			<h3 className="font-semibold mr-4 p-4">{profile?.email}</h3>
			<NavLink className="p-4" activeClassName="text-blue-400" to="/logout">
				Logout
			</NavLink>
		</nav>
	);
}
