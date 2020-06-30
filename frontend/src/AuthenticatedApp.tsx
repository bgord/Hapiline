import {Router, Route, Switch, Redirect} from "react-router-dom";
import * as React from "react";
import {SkipNavLink, SkipNavContent} from "@reach/skip-nav";

import {createBrowserHistory} from "history";

import {CalendarWindow} from "./windows/calendar/CalendarWindow";
import {DashboardWindow} from "./windows/dashboard/DashboardWindow";
import {HabitsProvider} from "./contexts/habits-context";
import {HabitsWindow} from "./HabitsWindow";
import {Logout} from "./Logout";
import {Toasts} from "./Toasts";
import {ProfileWindow} from "./windows/profile/ProfileWindow";
import {AuthenticatedNavbar} from "./AuthenticatedNavbar";
import * as UI from "./ui/";

const authenticatedAppBrowserHistory = createBrowserHistory();

function AuthenticatedApp() {
	return (
		<HabitsProvider>
			<Router history={authenticatedAppBrowserHistory}>
				<UI.Text as={SkipNavLink} variant="link" />
				<AuthenticatedNavbar />
				<SkipNavContent />
				<Toasts />
				<Switch>
					<Route exact path="/logout">
						<Logout />
					</Route>
					<Route exact path="/habits">
						<HabitsWindow />
					</Route>
					<Route exact path="/calendar">
						<CalendarWindow />
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
