import * as Async from "react-async";
import React from "react";

import {DayVote} from "./services/calendar";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";

interface DayDialogHabitVoteListProps {
	habit: IHabit;
	day: string;
	vote: DayVote["vote"] | undefined;
	onResolve: VoidFunction;
}

export const DayDialogHabitVoteListItem: React.FC<DayDialogHabitVoteListProps> = ({
	onResolve,
	vote,
	habit,
	day,
}) => {
	const triggerSuccessNotification = useSuccessNotification();
	const triggerErrorNotification = useErrorNotification();

	const addHabitDayVoteRequestState = Async.useAsync({
		deferFn: api.habit.addHabitDayVote,
		onResolve: () => {
			triggerSuccessNotification("Habit vote added successfully!");
			onResolve();
		},
		onReject: () => triggerErrorNotification("Error while changing habit vote."),
	});
	const progressButtonBg = vote === "progress" ? "bg-green-300" : "bg-white";
	const plateauButtonBg = vote === "plateau" ? "bg-gray-300" : "bg-white";
	const regressButtonBg = vote === "regress" ? "bg-red-300" : "bg-white";

	const payload = {day: new Date(day), habit_id: habit.id};

	return (
		<li key={habit.id} className="flex items-baseline justify-between bg-blue-100 my-2 p-2 mt-4">
			<span>{habit.name}</span>
			<div>
				<button
					onClick={() => {
						const nextVote = vote === "progress" ? null : "progress";
						addHabitDayVoteRequestState.run({...payload, vote: nextVote});
					}}
					className={`py-2 px-4 ${progressButtonBg}`}
					type="button"
					disabled={addHabitDayVoteRequestState.isPending}
				>
					+
				</button>
				<button
					onClick={() => {
						const nextVote = vote === "plateau" ? null : "plateau";
						addHabitDayVoteRequestState.run({...payload, vote: nextVote});
					}}
					className={`py-2 px-4 ${plateauButtonBg}`}
					type="button"
					disabled={addHabitDayVoteRequestState.isPending}
				>
					=
				</button>
				<button
					onClick={() => {
						const nextVote = vote === "regress" ? null : "regress";
						addHabitDayVoteRequestState.run({...payload, vote: nextVote});
					}}
					className={`py-2 px-4 ${regressButtonBg}`}
					type="button"
					disabled={addHabitDayVoteRequestState.isPending}
				>
					-
				</button>
			</div>
		</li>
	);
};
