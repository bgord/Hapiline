import {useQuery, useMutation} from "react-query";
import * as React from "react";

import {Notification, DraftNotificationPayload} from "./models";
import * as UI from "./ui";
import {BellIcon} from "./ui/icons/Bell";
import {api} from "./services/api";
import {useToggle} from "./hooks/useToggle";
import {useErrorToast} from "./contexts/toasts-context";
import {useMediaQuery, MEDIA_QUERY} from "./ui/breakpoints";
import {differenceInDays} from "date-fns";
import {useBodyScrollLock} from "./hooks/useBodyScrollLock";
import {formatTime, formatShortDayName} from "./services/date-formatter";
import {useKeyboardShortcurts} from "./hooks/useKeyboardShortcuts";

export function NotificationDropdown() {
	const triggerErrorToast = useErrorToast();
	const {
		on: areNotificationsVisible,
		setOff: hideNotifications,
		toggle: toggleNotifications,
	} = useToggle();

	const toggleNotificationsRef = React.useRef<HTMLButtonElement>(null);

	useKeyboardShortcurts({
		"Shift+KeyN": () => {
			toggleNotifications();
			toggleNotificationsRef.current?.focus();
		},
	});

	const mediaQuery = useMediaQuery();

	useBodyScrollLock(areNotificationsVisible && mediaQuery === MEDIA_QUERY.lg);

	const getNotificationsRequestState = useQuery<Notification[], "notifications">({
		queryKey: "notifications",
		queryFn: api.notifications.get,
		config: {
			retry: false,
			onError: () => triggerErrorToast("Couldn't fetch notifications."),
		},
	});

	const notifications = getNotificationsRequestState.data ?? [];

	const numberOfUnreadNotifications = notifications.filter(
		notification => notification.status === "unread",
	).length;

	return (
		<UI.Column>
			<UI.Button
				ref={toggleNotificationsRef}
				aria-label="Notifications dropdown"
				variant="bare"
				onClick={toggleNotifications}
				position="relative"
			>
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
					ml={[, "6"]}
					id="notification-list"
					onEntry="slide-down"
					position="absolute"
					width={["view-m", "auto"]}
					z="1"
					overflow="auto"
					data-b="gray-2"
					data-bw="1"
					style={{
						right: "12px",
						maxHeight: mediaQuery === MEDIA_QUERY.default ? "550px" : "450px",
					}}
				>
					<UI.Column py="6" px="12">
						<UI.Row mainAxis="between" mb={["24", "6"]}>
							<UI.Header variant="extra-small">Notifications</UI.Header>

							<UI.Badge ml="6" variant="neutral">
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
								<UI.ExpandContractList max={5}>
									{notifications.map(notification => (
										<NotificationItem
											key={notification.id}
											refetchNotifications={getNotificationsRequestState.refetch}
											{...notification}
										/>
									))}
								</UI.ExpandContractList>
							</UI.Column>
						</UI.ShowIf>

						<UI.ShowIf request={getNotificationsRequestState} is="error">
							<UI.Error>Couldn't fetch notifications.</UI.Error>
						</UI.ShowIf>
					</UI.Column>
				</UI.Card>
			)}
		</UI.Column>
	);
}

type NotificationProps = Notification & {refetchNotifications: VoidFunction};

function NotificationItem({refetchNotifications, ...notification}: NotificationProps) {
	const triggerErrorToast = useErrorToast();

	const [updateNotification, updateNotificationRequestState] = useMutation<
		Notification,
		DraftNotificationPayload
	>(api.notifications.update, {
		onSuccess: refetchNotifications,
		onError: () => triggerErrorToast("Couldn't change notification status."),
	});

	return (
		<UI.Row
			as="li"
			mainAxis="between"
			style={{
				borderLeftWidth: "var(--border-width-l)",
				borderLeftColor: "var(--gray-2)",
			}}
			crossAxis="start"
			mb="24"
			key={notification.id}
		>
			<UI.Column>
				<UI.Text ml="6">{notification.content}</UI.Text>
				<NotificationDate createdAt={notification.created_at} />
			</UI.Column>

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
	);
}

function NotificationDate({createdAt}: {createdAt: Notification["created_at"]}) {
	const createdAtDate = new Date(createdAt);

	function formatNotificationDate() {
		const todayDate = new Date();

		const numberOfDaysFromToday = differenceInDays(todayDate, createdAtDate);

		if (numberOfDaysFromToday === 0) return "today";
		if (numberOfDaysFromToday === 1) return "yesterday";
		return `${numberOfDaysFromToday} days ago`;
	}

	return (
		<UI.Text
			variant="info"
			ml="6"
			title={`${formatShortDayName(createdAtDate)} ${formatTime(createdAtDate)}`}
		>
			{formatNotificationDate()}
		</UI.Text>
	);
}
