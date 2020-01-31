import * as Async from "react-async";
import React from "react";

import {IHabit} from "../interfaces/IHabit";
import {api} from "../services/api";
import {useErrorNotification} from "./notifications-context";

type HabitsContext = Async.AsyncState<IHabit[]> | undefined;

const HabitsContext = React.createContext<HabitsContext>(undefined);

export const HabitsProvider: React.FC = props => {
	const triggerErrorNotification = useErrorNotification();

	const getHabitsRequestState = Async.useAsync({
		promiseFn: api.habit.get,
		onReject: () => triggerErrorNotification("Couldn't fetch habit list."),
	});
	return <HabitsContext.Provider value={getHabitsRequestState} {...props} />;
};

export function useHabitsState() {
	const context = React.useContext(HabitsContext);
	if (context === undefined) {
		throw new Error(`useHabits must be used within the HabitsContext`);
	}
	return context;
}

export function useHabits() {
	const context = React.useContext(HabitsContext);
	if (context === undefined) {
		throw new Error(`useHabits must be used within the HabitsContext`);
	}
	return context?.data ?? [];
}

export function useTrackedHabits() {
	const context = React.useContext(HabitsContext);
	if (context === undefined) {
		throw new Error(`useTrackedHabits must be used within the HabitsContext`);
	}
	return context?.data?.filter(habit => habit.is_trackable) ?? [];
}

export function useUntrackedHabits() {
	const context = React.useContext(HabitsContext);
	if (context === undefined) {
		throw new Error(`useUntrackedHabits must be used within the HabitsContext`);
	}
	return context?.data?.filter(habit => !habit.is_trackable) ?? [];
}
