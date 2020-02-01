import {Router, Route, Switch, Redirect, NavLink} from "react-router-dom";
import * as Async from "react-async";
import * as React from "react";

import {createBrowserHistory} from "history";

import {api} from "./services/api";
import {Calendar} from "./Calendar";
import {DashboardWindow} from "./DashboardWindow";
import {RequestErrorMessage} from "./ErrorMessages";
import {HabitsProvider} from "./contexts/habits-context";
import {HabitsWindow} from "./HabitsWindow";
import {Logo} from "./Logo";
import {Logout} from "./Logout";
import {Notifications} from "./Notifications";
import {useToggle} from "./hooks/useToggle";
import {useUserProfile} from "./contexts/auth-context";
import {useErrorNotification} from "./contexts/notifications-context";

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
	const triggerErrorNotification = useErrorNotification();
	const [areNotificationsVisible, , , toggleNotifications] = useToggle();

	const getNotificationsRequestState = Async.useAsync({
		promiseFn: api.notifications.get,
		onReject: () => triggerErrorNotification("Couldn't fetch notifications."),
	});

	const notifications = getNotificationsRequestState.data ?? [];

	const unreadNotifictionsNumber = notifications.filter(
		notification => notification.status === "unread",
	).length;

	return (
		<>
			<button type="button" onClick={toggleNotifications} className="px-4">
				<span role="img" aria-label="Notification bell">
					🔔
				</span>
			</button>
			{areNotificationsVisible && (
				<div
					style={{
						width: "500px",
					}}
					className="absolute h-48 bg-white mt-16 mr-2 p-2 shadow-lg overflow-auto"
				>
					<Async.IfPending state={getNotificationsRequestState}>Loading...</Async.IfPending>
					<Async.IfFulfilled state={getNotificationsRequestState}>
						<strong>Notifications ({unreadNotifictionsNumber})</strong>
						<ul className="mt-8">
							{notifications.map(notification => (
								<li key={notification.id} className="flex mt-6">
									{notification.content}
									{notification.status === "unread" && (
										<button type="button" className="whitespace-no-wrap ml-2 self-start">
											Mark as read
										</button>
									)}
									{notification.status === "read" && (
										<button type="button" className="whitespace-no-wrap ml-2 self-start">
											Mark as unread
										</button>
									)}
								</li>
							))}
						</ul>
					</Async.IfFulfilled>
					<Async.IfRejected state={getNotificationsRequestState}>
						<RequestErrorMessage>Couldn't fetch notifications...</RequestErrorMessage>
					</Async.IfRejected>
				</div>
			)}
		</>
	);
}
