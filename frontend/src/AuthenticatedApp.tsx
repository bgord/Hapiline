import {Router, Route, Switch, Redirect} from "react-router-dom";
import * as React from "react";

import {createBrowserHistory} from "history";

import {Calendar} from "./Calendar";
import {DashboardWindow} from "./windows/dashboard/DashboardWindow";
import {HabitsProvider} from "./contexts/habits-context";
import {HabitsWindow} from "./HabitsWindow";
import {Logout} from "./Logout";
import {Toasts} from "./Toasts";
import {ProfileWindow} from "./windows/profile/ProfileWindow";
import {AuthenticatedNavbar} from "./AuthenticatedNavbar";

const authenticatedAppBrowserHistory = createBrowserHistory();

function AuthenticatedApp() {
	return (
		<HabitsProvider>
			<Router history={authenticatedAppBrowserHistory}>
				<AuthenticatedNavbar />
				<Toasts />
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
					<Route exact path="/profile">
						<ProfileWindow />
					</Route>
					<Redirect to="/dashboard" />
				</Switch>
			</Router>
		</HabitsProvider>
	);
}

export default AuthenticatedApp;
