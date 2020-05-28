import {Router, Route, Switch, Redirect, NavLink} from "react-router-dom";
import {useQuery, useMutation} from "react-query";
import * as React from "react";
import VisuallyHidden from "@reach/visually-hidden";

import {createBrowserHistory} from "history";
import {Notification, DraftNotificationPayload} from "./interfaces/index";

import * as UI from "./ui";
import {BellIcon} from "./ui/icons/Bell";
import {api} from "./services/api";
import {Calendar} from "./Calendar";
import {DashboardWindow} from "./DashboardWindow";
import {HabitsProvider} from "./contexts/habits-context";
import {HabitsWindow} from "./HabitsWindow";
import {Logo} from "./Logo";
import {Logout} from "./Logout";
import {Toasts} from "./Toasts";
import {useToggle} from "./hooks/useToggle";
import {useUserProfile} from "./contexts/auth-context";
import {useErrorToast} from "./contexts/toasts-context";
import {ProfileWindow} from "./ProfileWindow";

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

function NotificationDropdown() {
	const triggerErrorNotification = useErrorToast();
	const [areNotificationsVisible, , hideNotifications, toggleNotifications] = useToggle();

	const getNotificationsRequestState = useQuery<Notification[], "notifications">({
		queryKey: "notifications",
		queryFn: api.notifications.get,
		config: {
			onError: () => triggerErrorNotification("Couldn't fetch notifications."),
		},
	});

	const [updateNotification, updateNotificationRequestState] = useMutation<
		Notification,
		DraftNotificationPayload
	>(api.notifications.update, {
		onSuccess: () => {
			getNotificationsRequestState.refetch();
		},
		onError: () => triggerErrorNotification("Couldn't change notification status."),
	});

	const notifications = getNotificationsRequestState.data ?? [];

	const unreadNotifictionsNumber = notifications.filter(
		notification => notification.status === "unread",
	).length;

	function markNotificationAsRead(id: Notification["id"]) {
		const payload: DraftNotificationPayload = {
			id,
			status: "read",
		};
		updateNotification(payload);
	}

	function markNotificationAsUnread(id: Notification["id"]) {
		const payload: DraftNotificationPayload = {
			id,
			status: "unread",
		};
		updateNotification(payload);
	}

	return (
		<UI.Column>
			<UI.Button variant="bare" onClick={toggleNotifications} style={{position: "relative"}}>
				<VisuallyHidden>Notifications dropdown</VisuallyHidden>
				<BellIcon />
				{unreadNotifictionsNumber > 0 && (
					<UI.Text position="absolute" style={{top: "-3px", right: "3px"}}>
						{unreadNotifictionsNumber}
					</UI.Text>
				)}
			</UI.Button>
			{areNotificationsVisible && (
				<UI.Card
					mt="72"
					id="notification-list"
					position="absolute"
					style={{width: "500px", right: "12px"}}
				>
					<UI.Column p="24">
						<UI.Row mainAxis="between" mb="24">
							<UI.Header variant="extra-small">Notifications</UI.Header>
							<UI.Badge ml="6" variant="neutral" style={{padding: "3px 6px"}}>
								{unreadNotifictionsNumber}
							</UI.Badge>
							<UI.CloseIcon ml="auto" onClick={hideNotifications} />
						</UI.Row>

						<UI.ShowIf request={getNotificationsRequestState} is="loading">
							<UI.Text>Loading...</UI.Text>
						</UI.ShowIf>

						<UI.ShowIf request={getNotificationsRequestState} is="success">
							{notifications.length === 0 && <UI.Text>You don't have any notifications.</UI.Text>}
							<UI.Column as="ul">
								{notifications.map(notification => (
									<UI.Row
										as="li"
										bw="2"
										b="gray-2"
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
												disabled={updateNotificationRequestState.status === "loading"}
												onClick={() => markNotificationAsRead(notification.id)}
											>
												Read
											</UI.Button>
										)}

										{notification.status === "read" && (
											<UI.Button
												style={{width: "100px"}}
												variant="outlined"
												disabled={updateNotificationRequestState.status === "loading"}
												onClick={() => markNotificationAsUnread(notification.id)}
											>
												Unread
											</UI.Button>
										)}
									</UI.Row>
								))}
							</UI.Column>
						</UI.ShowIf>

						<UI.ShowIf request={getNotificationsRequestState} is="error">
							<UI.Error>Couldn't fetch notifications...</UI.Error>
						</UI.ShowIf>
					</UI.Column>
				</UI.Card>
			)}
		</UI.Column>
	);
}
