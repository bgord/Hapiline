import * as Async from "react-async";
import React from "react";

import {IHabit} from "../interfaces/IHabit";
import {api} from "../services/api";
import {useNotification} from "./notifications-context";

type HabitsContext = Async.AsyncState<IHabit[]> | undefined;

const HabitsContext = React.createContext<HabitsContext>(undefined);

export const HabitsProvider: React.FC = props => {
	const [triggerErrorNotification] = useNotification();

	const getHabitsRequestState = Async.useAsync({
		promiseFn: api.habit.get,
		onResolve: () => console.log("running", Date.now()),
		onReject: () =>
			triggerErrorNotification({
				type: "error",
				message: "Couldn't fetch habit list.",
			}),
	});
	return <HabitsContext.Provider value={getHabitsRequestState} {...props} />;
};

export function useHabits() {
	const context = React.useContext(HabitsContext);
	if (context === undefined) {
		throw new Error(`useHabits must be used within the HabitsContext`);
	}
	return context;
}
