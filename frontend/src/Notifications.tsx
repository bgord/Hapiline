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
		<UI.Row
			as={Alert}
			position="relative"
			style={{minWidth: "350px", background: typeToBgColor[type]}}
			mainAxis="between"
			width="100%"
			p="12"
			mt="12"
		>
			<UI.Text>{message}</UI.Text>
			<UI.CloseIcon bg="inherit" onClick={removeNotification} />
		</UI.Row>
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
		<UI.Column position="fixed" m="12" style={{bottom: 0, right: 0}}>
			{transitions.map(({item, props, key}) => (
				<animated.div key={key} style={props}>
					<NotificationItem {...item}>{item.message}</NotificationItem>
				</animated.div>
			))}
		</UI.Column>
	);
};
