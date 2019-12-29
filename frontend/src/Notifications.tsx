import React from "react";

import Alert from "@reach/alert";
import {useTransition, animated} from "react-spring";

import {useNotificationState, Notification} from "./contexts/notifications-context";

const NotificationItem: React.FC<Notification> = ({type, message}) => {
	const typeToBgColor = {
		success: "green",
		info: "blue",
		error: "red",
	};

	return (
		<Alert
			style={{
				minWidth: "350px",
			}}
			className={`relative flex justify-between bg-${typeToBgColor[type]}-300 p-4 mt-4`}
		>
			{message}
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
