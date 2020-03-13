import {Router, Route, Switch, Redirect, NavLink} from "react-router-dom";
import * as Async from "react-async";
import * as React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell} from "@fortawesome/free-solid-svg-icons";
import VisuallyHidden from "@reach/visually-hidden";

import {createBrowserHistory} from "history";

import * as UI from "./ui";
import {api} from "./services/api";
import {Calendar} from "./Calendar";
import {DashboardWindow} from "./DashboardWindow";
import {HabitsProvider} from "./contexts/habits-context";
import {HabitsWindow} from "./HabitsWindow";
import {Logo} from "./Logo";
import {Logout} from "./Logout";
import {Notifications} from "./Notifications";
import {useToggle} from "./hooks/useToggle";
import {useUserProfile} from "./contexts/auth-context";
import {useErrorNotification} from "./contexts/notifications-context";
import {ProfileWindow} from "./ProfileWindow";

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
		<nav>
			<UI.Row style={{background: "var(--gray-0)", borderBottom: "2px solid var(--gray-2)"}}>
				<NavLink activeClassName="c-active-link" data-ml="12" data-mr="auto" exact to="/dashboard">
					<Logo />
				</NavLink>
				<UI.NavItem to="/dashboard">Dashboard</UI.NavItem>
				<UI.NavItem to="/habits">Habits</UI.NavItem>
				<UI.NavItem to="/calendar">Calendar</UI.NavItem>
				<UI.NavItem to="/profile">{profile?.email}</UI.NavItem>
				<NotificationDropdown />
				<UI.NavItem to="/logout">Logout</UI.NavItem>
			</UI.Row>
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
		<UI.Column>
			<UI.Button
				variant="bare"
				onClick={toggleNotifications}
				style={{
					position: "relative",
					alignSelf: "center",
					fontSize: "24px",
				}}
			>
				<VisuallyHidden>Notifications dropdown</VisuallyHidden>
				<FontAwesomeIcon icon={faBell} />
				<UI.Text
					hidden={unreadNotifictionsNumber === 0}
					style={{position: "absolute", top: "-3px"}}
				>
					{unreadNotifictionsNumber}
				</UI.Text>
			</UI.Button>
			{areNotificationsVisible && (
				<UI.Card
					mt="72"
					id="notification-list"
					style={{
						width: "500px",
						position: "absolute",
						right: "12px",
					}}
				>
					<UI.Column p="24">
						<UI.Row mainAxis="between" mb="24">
							<UI.Header variant="extra-small">Notifications</UI.Header>
							<UI.Badge ml="6" variant="neutral" style={{padding: "3px 6px"}}>
								{unreadNotifictionsNumber}
							</UI.Badge>
							<UI.CloseIcon ml="auto" onClick={hideNotifications} />
						</UI.Row>

						<Async.IfPending state={getNotificationsRequestState}>
							<UI.Text>Loading...</UI.Text>
						</Async.IfPending>

						<Async.IfFulfilled state={getNotificationsRequestState}>
							<UI.Column>
								{notifications.length === 0 && <UI.Text>You don't have any notifications.</UI.Text>}

								{notifications.map(notification => (
									<UI.Row
										style={{borderTop: "1px solid var(--gray-2)"}}
										mainAxis="between"
										crossAxis="center"
										mt="12"
										pt="6"
										key={notification.id}
									>
										<UI.Text>{notification.content}</UI.Text>

										{notification.status === "unread" && (
											<UI.Button
												variant="secondary"
												style={{width: "100px"}}
												disabled={updateNotificationRequestState.isPending}
												onClick={() => markNotificationAsRead(notification.id)}
											>
												Read
											</UI.Button>
										)}

										{notification.status === "read" && (
											<UI.Button
												style={{width: "100px"}}
												variant="outlined"
												disabled={updateNotificationRequestState.isPending}
												onClick={() => markNotificationAsUnread(notification.id)}
											>
												Unread
											</UI.Button>
										)}
									</UI.Row>
								))}
							</UI.Column>
						</Async.IfFulfilled>

						<Async.IfRejected state={getNotificationsRequestState}>
							<UI.Error>Couldn't fetch notifications...</UI.Error>
						</Async.IfRejected>
					</UI.Column>
				</UI.Card>
			)}
		</UI.Column>
	);
}
