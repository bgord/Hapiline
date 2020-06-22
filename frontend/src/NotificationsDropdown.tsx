import {useQuery, useMutation} from "react-query";
import * as React from "react";

import {Notification, DraftNotificationPayload} from "./models";
import * as UI from "./ui";
import {BellIcon} from "./ui/icons/Bell";
import {api} from "./services/api";
import {useToggle} from "./hooks/useToggle";
import {useErrorToast} from "./contexts/toasts-context";
import {useMediaQuery, MEDIA_QUERY} from "./ui/breakpoints";
import {formatDay} from "./services/date-formatter";

export function NotificationDropdown() {
	const triggerErrorToast = useErrorToast();
	const {
		on: areNotificationsVisible,
		setOff: hideNotifications,
		toggle: toggleNotifications,
	} = useToggle();

	const mediaQuery = useMediaQuery();

	const getNotificationsRequestState = useQuery<Notification[], "notifications">({
		queryKey: "notifications",
		queryFn: api.notifications.get,
		config: {
			onError: () => triggerErrorToast("Couldn't fetch notifications."),
		},
	});

	const [updateNotification, updateNotificationRequestState] = useMutation<
		Notification,
		DraftNotificationPayload
	>(api.notifications.update, {
		onSuccess: () => {
			getNotificationsRequestState.refetch();
		},
		onError: () => triggerErrorToast("Couldn't change notification status."),
	});

	const notifications = getNotificationsRequestState.data ?? [];

	const numberOfUnreadNotifications = notifications.filter(
		notification => notification.status === "unread",
	).length;
	return (
		<UI.Column>
			<UI.Button variant="bare" onClick={toggleNotifications} style={{position: "relative"}}>
				<UI.VisuallyHidden>Notifications dropdown</UI.VisuallyHidden>
				<BellIcon />

				{numberOfUnreadNotifications > 0 && (
					<UI.Text position="absolute" style={{top: "-3px", right: "3px"}}>
						{numberOfUnreadNotifications}
					</UI.Text>
				)}
			</UI.Button>

			{areNotificationsVisible && (
				<UI.Card
					mt="72"
					id="notification-list"
					position="absolute"
					width={["view-m", "auto"]}
					style={{
						right: "12px",
						maxHeight: mediaQuery === MEDIA_QUERY.default ? "550px" : "450px",
						overflowY: "auto",
					}}
				>
					<UI.Column py="24" px="12">
						<UI.Row mainAxis="between" mb={["24", "6"]}>
							<UI.Header variant="extra-small">Notifications</UI.Header>

							<UI.Badge ml="6" variant="neutral" style={{padding: "3px 6px"}}>
								{numberOfUnreadNotifications}
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
										mainAxis="between"
										style={{
											borderLeftWidth: "var(--border-width-l)",
											borderLeftColor: "var(--gray-2)",
										}}
										crossAxis="center"
										mt="24"
										key={notification.id}
									>
										<UI.Text ml="6">{notification.content}</UI.Text>
										<UI.Text variant="light" ml="6">
											{formatDay(notification?.created_at)}
										</UI.Text>

										{notification.status === "unread" && (
											<UI.Button
												ml="12"
												style={{minWidth: "85px"}}
												variant="secondary"
												disabled={updateNotificationRequestState.status === "loading"}
												onClick={() => updateNotification({id: notification.id, status: "read"})}
											>
												Read
											</UI.Button>
										)}

										{notification.status === "read" && (
											<UI.Button
												ml="12"
												style={{minWidth: "85px"}}
												variant="outlined"
												disabled={updateNotificationRequestState.status === "loading"}
												onClick={() => updateNotification({id: notification.id, status: "unread"})}
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
