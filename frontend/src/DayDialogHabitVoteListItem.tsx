import * as Async from "react-async";
import React from "react";

import {DayVotes} from "./services/calendar";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {useNotification} from "./contexts/notifications-context";

interface DayDialogHabitVoteListProps {
	habit: IHabit;
	day: string;
	dayVotes: DayVotes[];
	onResolve: VoidFunction;
}

export const DayDialogHabitVoteListItem: React.FC<DayDialogHabitVoteListProps> = ({
	onResolve,
	dayVotes,
	habit,
	day,
}) => {
	const [triggerSuccessNotification] = useNotification();
	const [triggerErrorNotification] = useNotification();

	const addHabitDayVoteRequestState = Async.useAsync({
		deferFn: api.habit.addHabitDayVote,
		onResolve: () => {
			triggerSuccessNotification({
				type: "success",
				message: "Habit vote added successfully!",
			});
			onResolve();
		},
		onReject: () => {
			triggerErrorNotification({
				type: "error",
				message: "Error while changing habit vote.",
			});
		},
	});
	const habitVote = dayVotes.find(vote => vote.habit_id === habit.id)?.vote;

	const progressButtonBg = habitVote === "progress" ? "bg-green-300" : "bg-white";
	const plateauButtonBg = habitVote === "plateau" ? "bg-gray-300" : "bg-white";
	const regressButtonBg = habitVote === "regress" ? "bg-red-300" : "bg-white";

	const payload = {day: new Date(day), habit_id: habit.id};

	return (
		<li key={habit.id} className="flex items-baseline justify-between bg-blue-100 my-2 p-2 mt-4">
			<span>{habit.name}</span>
			<div>
				<button
					onClick={() => {
						const nextVote = habitVote === "progress" ? null : "progress";
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
						const nextVote = habitVote === "plateau" ? null : "plateau";
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
						const nextVote = habitVote === "regress" ? null : "regress";
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
