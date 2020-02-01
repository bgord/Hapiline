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
import {useToggle} from "./hooks/useToggle";
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
			<h3 className="font-semibold p-4">{profile?.email}</h3>
			<NotificationDropdown />
			<NavLink className="p-4" activeClassName="text-blue-400" to="/logout">
				Logout
			</NavLink>
		</nav>
	);
}

function NotificationDropdown() {
	const [areNotificationsVisible, , , toggleNotifications] = useToggle();

	const notifications = [
		"Congratulations, you've added your first habit!",
		'You\'ve achieved five-day streak in your "Reading 5 minutes a day" habit!',
	];

	return (
		<>
			<button type="button" onClick={toggleNotifications} className="px-4">
				🔔
			</button>
			{areNotificationsVisible && (
				<div
					style={{
						width: "500px",
					}}
					className="absolute h-48 bg-white mt-16 mr-2 p-2 shadow-lg"
				>
					<strong>Notifications ({notifications.length})</strong>
					<ul className="mt-8">
						{notifications.map(notification => (
							<li className="flex mt-6">
								{notification}
								<button type="button" className="whitespace-no-wrap ml-2 self-start">
									Mark as read
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</>
	);
}
