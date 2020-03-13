import {useTransition, animated} from "react-spring";
import Alert from "@reach/alert";
import React from "react";

import * as UI from "./ui";
import {INotification, NotificationType} from "./interfaces/INotification";
import {useNotificationDispatch, useNotificationState} from "./contexts/notifications-context";

const NotificationItem: React.FC<INotification> = ({id, type, message}) => {
	const dispatch = useNotificationDispatch();

	const typeToBgColor: {[key in NotificationType]: string} = {
		success: "var(--green-light)",
		error: "var(--red-light)",
	};

	const removeNotification = () => dispatch({type: "remove", id});

	return (
		<Alert style={{minWidth: "350px", position: "relative", background: typeToBgColor[type]}}>
			<UI.Row mainAxis="between" width="100%" p="12" mt="12">
				<UI.Text>{message}</UI.Text>
				<UI.CloseIcon style={{background: "inherit"}} onClick={removeNotification} />
			</UI.Row>
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
