import {useQuery, QueryResult} from "react-query";
import React from "react";

import {api} from "../services/api";
import {useErrorToast} from "./toasts-context";
import {Habit} from "../interfaces/index";

type HabitsContext = QueryResult<Habit[]> | undefined;

const HabitsContext = React.createContext<HabitsContext>(undefined);

export const HabitsProvider: React.FC = props => {
	const triggerErrorNotification = useErrorToast();

	const getHabitsRequestState = useQuery<Habit[], "all_habits">({
		queryKey: "all_habits",
		queryFn: api.habit.get,
		config: {
			onError: () => triggerErrorNotification("Couldn't fetch habit list."),
		},
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
