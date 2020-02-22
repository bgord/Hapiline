import {Router, Route, Switch, Redirect, NavLink} from "react-router-dom";
import * as Async from "react-async";
import * as React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell} from "@fortawesome/free-solid-svg-icons";

import {createBrowserHistory} from "history";

import {Text} from "./ui/text/Text";
import {Header} from "./ui/header/Header";
import {Button} from "./ui/button/Button";
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
import {CloseIcon} from "./ui/close-icon/CloseIcon";
import {ProfileWindow} from "./ProfileWindow";
import {Row} from "./ui/row/Row";

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
		<nav className="flex justify-end py-1 bg-white shadow-md">
			<NavLink
				className="c-text ml-2 mr-auto p-2"
				exact
				activeClassName="text-blue-400"
				to="/dashboard"
			>
				<Logo />
			</NavLink>
			<NavLink exact className="p-4" activeClassName="text-blue-400" to="/dashboard">
				Dashboard
			</NavLink>
			<NavLink exact className="c-text p-4" activeClassName="text-blue-400" to="/habits">
				Habits
			</NavLink>
			<NavLink className="p-4" activeClassName="text-blue-400" to="/calendar">
				Calendar
			</NavLink>
			<NavLink to="/profile" activeClassName="text-blue-400">
				<h3 className="font-semibold p-4">{profile?.email}</h3>
			</NavLink>
			<NotificationDropdown />
			<NavLink className="p-4" activeClassName="text-blue-400" to="/logout">
				Logout
			</NavLink>
		</nav>
	);
}

function NotificationDropdown() {
	const triggerErrorNotification = useErrorNotification();
	const [areNotificationsVisible, , hideNotifications, toggleNotifications] = useToggle();

	const getNotificationsRequestState = Async.useAsync({
		promiseFn: api.notifications.get,
		onReject: () => triggerErrorNotification("Couldn't fetch notifications."),
	});

	const updateNotificationRequestState = Async.useAsync({
		deferFn: api.notifications.update,
		onResolve: getNotificationsRequestState.reload,
		onReject: () => triggerErrorNotification("Couldn't change notification status."),
	});

	const notifications = getNotificationsRequestState.data ?? [];

	const unreadNotifictionsNumber = notifications.filter(
		notification => notification.status === "unread",
	).length;

	function markNotificationAsRead(id: number) {
		updateNotificationRequestState.run(id, {status: "read"});
	}

	function markNotificationAsUnread(id: number) {
		updateNotificationRequestState.run(id, {status: "unread"});
	}

	return (
		<>
			<Button
				variant="outlined"
				onClick={toggleNotifications}
				style={{
					position: "relative",
					alignSelf: "center",
					fontSize: "24px",
				}}
			>
				<FontAwesomeIcon icon={faBell} />
				<span
					hidden={unreadNotifictionsNumber === 0}
					style={{position: "absolute", top: "-4px", fontSize: "16px"}}
				>
					{unreadNotifictionsNumber}
				</span>
			</Button>
			{areNotificationsVisible && (
				<div
					id="notification-list"
					style={{
						width: "500px",
					}}
					className="absolute h-64 bg-white mt-16 mr-2 p-3 shadow-lg overflow-auto"
				>
					<Async.IfPending state={getNotificationsRequestState}>Loading...</Async.IfPending>
					<Async.IfFulfilled state={getNotificationsRequestState}>
						<Row mainAxis="between">
							<Header variant="extra-small">Notifications ({unreadNotifictionsNumber})</Header>
							<CloseIcon onClick={hideNotifications} />
						</Row>
						<ul className="mt-8">
							{notifications.length === 0 && <Text>You don't have any notifications.</Text>}
							{notifications.map(notification => (
								<li key={notification.id} className="flex items-center mt-6">
									{notification.content}
									{notification.status === "unread" && (
										<Button
											variant="secondary"
											disabled={updateNotificationRequestState.isPending}
											onClick={() => markNotificationAsRead(notification.id)}
											style={{marginLeft: "6px"}}
										>
											Mark as read
										</Button>
									)}
									{notification.status === "read" && (
										<Button
											variant="outlined"
											onClick={() => markNotificationAsUnread(notification.id)}
											disabled={updateNotificationRequestState.isPending}
											style={{marginLeft: "6px"}}
										>
											Mark as unread
										</Button>
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
