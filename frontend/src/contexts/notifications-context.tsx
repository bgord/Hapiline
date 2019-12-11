import React from "react";

interface Notification {
	id: number;
	type: "success" | "error" | "info";
	message: string;
}

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
		case "add": {
			return [...state, action.notification];
		}
		case "remove": {
			return state.filter(notification => notification.id !== action.id);
		}
		case "clear": {
			return [];
		}
	}
}

const NotificationsStateContext = React.createContext<State | undefined>(
	undefined,
);
const NotificationsDispatchContext = React.createContext<Dispatch | undefined>(
	undefined,
);

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

export function useNotifications() {
	const context = React.useContext(NotificationsStateContext);
	if (context === undefined) {
		throw new Error(
			`useNotificationsState must be used within the NotificationProvider`,
		);
	}
	return context;
}

export function useNotificationActions() {
	const context = React.useContext(NotificationsDispatchContext);
	if (context === undefined) {
		throw new Error(
			`useNotificationsDispatch must be used within the NotificationProvider`,
		);
	}
	return context;
}
