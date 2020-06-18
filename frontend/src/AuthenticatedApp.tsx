import {Router, Route, Switch, Redirect, NavLink} from "react-router-dom";
import * as React from "react";

import {createBrowserHistory} from "history";

import * as UI from "./ui";
import {Calendar} from "./Calendar";
import {DashboardWindow} from "./windows/dashboard/DashboardWindow";
import {HabitsProvider} from "./contexts/habits-context";
import {HabitsWindow} from "./HabitsWindow";
import {Logo} from "./Logo";
import {Logout} from "./Logout";
import {Toasts} from "./Toasts";
import {useUserProfile} from "./contexts/auth-context";
import {ProfileWindow} from "./windows/profile/ProfileWindow";
import {NotificationDropdown} from "./NotificationsDropdown";

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

function AuthenticatedNavbar() {
	const [profile] = useUserProfile();

	return (
		<UI.Row as="nav" bg="gray-0" bw="2" bb="gray-2">
			<NavLink activeClassName="c-active-link" data-ml="12" data-mr="auto" exact to="/dashboard">
				<Logo />
			</NavLink>
			<UI.NavItem to="/dashboard">Dashboard</UI.NavItem>
			<UI.NavItem to="/habits">Habits</UI.NavItem>
			<UI.NavItem to="/calendar">Calendar</UI.NavItem>
			<UI.NavItem variant="bold" to="/profile">
				{profile?.email}
			</UI.NavItem>
			<NotificationDropdown />
			<UI.NavItem to="/logout">Logout</UI.NavItem>
		</UI.Row>
	);
}
