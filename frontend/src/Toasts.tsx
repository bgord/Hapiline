import {useTransition, animated} from "react-spring";
import Alert from "@reach/alert";
import React from "react";

import * as UI from "./ui";
import {Toast, ToastType} from "./interfaces/Toast";
import {useToastDispatch, useToastsState} from "./contexts/toasts-context";

const ToastItem: React.FC<Toast> = ({id, type, message}) => {
	const dispatch = useToastDispatch();

	const typeToBgColor: {[key in ToastType]: string} = {
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
			<UI.CloseIcon bg="transparent" onClick={removeNotification} />
		</UI.Row>
	);
};

export const Toasts = () => {
	const notifications = useToastsState();

	const transitions = useTransition(notifications, notification => notification.id, {
		from: {opacity: 0, right: -50, position: "relative"},
		enter: {opacity: 1, right: 0},
		leave: {opacity: 0, right: -50},
	});

	return (
		<UI.Column position="fixed" m="12" style={{bottom: 0, right: 0, zIndex: 1}}>
			{transitions.map(({item, props, key}) => (
				<animated.div key={key} style={props}>
					<ToastItem {...item}>{item.message}</ToastItem>
				</animated.div>
			))}
		</UI.Column>
	);
};