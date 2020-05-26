import React from "react";

export type ToastType = "success" | "error";

export interface Toast {
	id: number;
	type: ToastType;
	message: string;
}

type State = Toast[];

type Action =
	| {
			type: "add";
			toast: Toast;
	  }
	| {
			type: "remove";
			id: Toast["id"];
	  }
	| {
			type: "clear";
	  };
type Dispatch = (action: Action) => void;

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "add":
			return [...state, action.toast];
		case "remove":
			return state.filter(toast => toast.id !== action.id);
		case "clear":
			return [];
		default:
			return state;
	}
}

const ToastsStateContext = React.createContext<State | undefined>(undefined);
const ToastsDispatchContext = React.createContext<Dispatch | undefined>(undefined);

export const ToastsProvider: React.FC = ({children}) => {
	const [state, dispatch] = React.useReducer(reducer, []);
	return (
		<ToastsStateContext.Provider value={state}>
			<ToastsDispatchContext.Provider value={dispatch}>{children}</ToastsDispatchContext.Provider>
		</ToastsStateContext.Provider>
	);
};

export function useToastsState() {
	const state = React.useContext(ToastsStateContext);
	if (state === undefined) {
		throw new Error(`useToastsState must be used within the ToastsProvider`);
	}
	return state;
}

export function useToastDispatch() {
	const dispatch = React.useContext(ToastsDispatchContext);
	if (dispatch === undefined) {
		throw new Error(`useToastDispatch must be used within the ToastsProvider`);
	}
	return dispatch;
}

export function useToast(timeout = 5000) {
	const dispatch = useToastDispatch();

	const triggerToast = (toast: Omit<Toast, "id">): void => {
		const id = Date.now();

		dispatch({
			type: "add",
			toast: {
				id,
				...toast,
			},
		});
		setTimeout(() => {
			dispatch({
				type: "remove",
				id,
			});
		}, timeout);
	};

	return [triggerToast];
}

export function useSuccessToast() {
	const [triggerToast] = useToast();
	return (message: Toast["message"]) => triggerToast({type: "success", message});
}

export function useErrorToast() {
	const [triggerToast] = useToast();
	return (message: Toast["message"]) => triggerToast({type: "error", message});
}
