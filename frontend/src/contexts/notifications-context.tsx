import React from "react";

import {Notification} from "../interfaces/INotification";

type State = Notification[];

type Action =
	| {
			type: "add";
			notification: Notification;
	  }
	| {
			type: "remove";
			id: Notification["id"];
	  }
	| {
			type: "clear";
	  };
type Dispatch = (action: Action) => void;

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "add":
			return [...state, action.notification];
		case "remove":
			return state.filter(notification => notification.id !== action.id);
		case "clear":
			return [];
		default:
			return state;
	}
}

const NotificationsStateContext = React.createContext<State | undefined>(undefined);
const NotificationsDispatchContext = React.createContext<Dispatch | undefined>(undefined);

export const NotificationsProvider: React.FC = ({children}) => {
	const [state, dispatch] = React.useReducer(reducer, []);
	return (
		<NotificationsStateContext.Provider value={state}>
			<NotificationsDispatchContext.Provider value={dispatch}>
				{children}
			</NotificationsDispatchContext.Provider>
		</NotificationsStateContext.Provider>
	);
};

export function useNotificationState() {
	const state = React.useContext(NotificationsStateContext);
	if (state === undefined) {
		throw new Error(`useNotificationsState must be used within the NotificationProvider`);
	}
	return state;
}

export function useNotificationDispatch() {
	const dispatch = React.useContext(NotificationsDispatchContext);
	if (dispatch === undefined) {
		throw new Error(`useNotificationsState must be used within the NotificationProvider`);
	}
	return dispatch;
}

export function useNotification(timeout = 5000) {
	const dispatch = useNotificationDispatch();

	const triggerNotification = (notification: Omit<Notification, "id">): void => {
		const id = Date.now();

		dispatch({
			type: "add",
			notification: {
				id,
				...notification,
			},
		});
		setTimeout(() => {
			dispatch({
				type: "remove",
				id,
			});
		}, timeout);
	};

	return [triggerNotification];
}

export function useSuccessNotification() {
	const [triggerNotification] = useNotification();
	return (message: Notification["message"]) => triggerNotification({type: "success", message});
}

export function useErrorNotification() {
	const [triggerNotification] = useNotification();
	return (message: Notification["message"]) => triggerNotification({type: "error", message});
}
