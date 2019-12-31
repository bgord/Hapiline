import {useTransition, animated} from "react-spring";
import Alert from "@reach/alert";
import React from "react";

import {CloseButton} from "./CloseButton";
import {Notification, NotificationType} from "./interfaces/INotification";
import {useNotificationDispatch, useNotificationState} from "./contexts/notifications-context";

const NotificationItem: React.FC<Notification> = ({id, type, message}) => {
	const dispatch = useNotificationDispatch();

	const typeToBgColor: {[key in NotificationType]: string} = {
		success: "green",
		info: "blue",
		error: "red",
	};

	const removeNotification = () => dispatch({type: "remove", id});

	return (
		<Alert
			style={{
				minWidth: "350px",
			}}
			className={`relative flex justify-between items-center bg-${typeToBgColor[type]}-300 p-3 mt-4`}
		>
			{message}
			<CloseButton onClick={removeNotification} />
		</Alert>
	);
};

export const Notifications = () => {
	const notifications = useNotificationState();

	const transitions = useTransition(notifications, notification => notification.id, {
		from: {opacity: 0, right: -50, position: "relative"},
		enter: {opacity: 1, right: 0},
		leave: {opacity: 0, right: -50},
	});

	return (
		<div className="fixed bottom-0 right-0 m-2 z-50">
			{transitions.map(({item, props, key}) => (
				<animated.div key={key} style={props}>
					<NotificationItem {...item}>{item.message}</NotificationItem>
				</animated.div>
			))}
		</div>
	);
};
