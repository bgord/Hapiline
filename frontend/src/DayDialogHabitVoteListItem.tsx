import * as Async from "react-async";
import React from "react";
import {Link} from "react-router-dom";

import {BareButton} from "./BareButton";
import {IHabit} from "./interfaces/IHabit";
import {Vote} from "./interfaces/IDayVote";
import {api} from "./services/api";
import {useErrorNotification, useSuccessNotification} from "./contexts/notifications-context";

interface DayDialogHabitVoteListProps {
	habit: IHabit;
	day: string;
	vote: Vote | undefined;
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

	function changeVote(type: NonNullable<Vote>) {
		addHabitDayVoteRequestState.run({
			day: new Date(day),
			habit_id: habit.id,
			vote: vote === type ? null : type,
		});
	}

	return (
		<li className="flex items-baseline justify-between bg-blue-100 my-2 p-2 mt-4">
			<Link to={`/dashboard?previewHabitId=${habit.id}`}>{habit.name}</Link>
			<div>
				<BareButton
					onClick={() => changeVote("progress")}
					className={progressButtonBg}
					disabled={addHabitDayVoteRequestState.isPending}
				>
					+
				</BareButton>
				<BareButton
					onClick={() => changeVote("plateau")}
					className={plateauButtonBg}
					disabled={addHabitDayVoteRequestState.isPending}
				>
					=
				</BareButton>
				<BareButton
					onClick={() => changeVote("regress")}
					disabled={addHabitDayVoteRequestState.isPending}
					className={regressButtonBg}
				>
					-
				</BareButton>
			</div>
		</li>
	);
};
