import {Dialog} from "@reach/dialog";
import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {CloseButton} from "./CloseButton";
import {DayDialogHabitVoteListItem} from "./DayDialogHabitVoteListItem";
import {DayDialogSummary} from "./DayDialogSummary";
import {DayVoteStats} from "./interfaces/IMonthDay";
import {IDayVote, Vote} from "./interfaces/IDayVote";
import {IHabit} from "./interfaces/IHabit";
import {api} from "./services/api";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {useErrorNotification} from "./contexts/notifications-context";
import {useHabits} from "./contexts/habits-context";

type DayDialogProps = DayVoteStats & {
	refreshCalendar: VoidFunction;
};

export const DayDialog: React.FC<DayDialogProps> = ({day, refreshCalendar, ...stats}) => {
	const history = useHistory();
	const habits = useHabits();
	const triggerErrorNotification = useErrorNotification();

	const getDayVotesRequestState = Async.useAsync({
		promiseFn: api.calendar.getDay,
		day,
		onReject: () => triggerErrorNotification("Couldn't fetch habit votes."),
	});

	const habitsAvailableAtThisDay = getHabitsAvailableAtThisDay(habits, day);

	const areAnyHabitsAvailable = habitsAvailableAtThisDay.length === 0;

	function dismissDialog() {
		history.push("/calendar");
	}

	return (
		<Dialog
			aria-label="Show day preview"
			onDismiss={dismissDialog}
			className="overflow-auto"
			style={{
				maxWidth: "1000px",
				maxHeight: "700px",
			}}
		>
			<div className="flex justify-between items-baseline">
				<strong>{day}</strong>
				<CloseButton onClick={dismissDialog} />
			</div>
			{areAnyHabitsAvailable && <div>No habits available this day.</div>}
			<ul data-testid="day-dialog-habits">
				{habitsAvailableAtThisDay.map(habit => (
					<DayDialogHabitVoteListItem
						key={habit.id}
						habit={habit}
						day={day}
						vote={getDayVoteForHabit(getDayVotesRequestState, habit)}
						onResolve={() => {
							refreshCalendar();
							getDayVotesRequestState.reload();
						}}
					/>
				))}
			</ul>
			<DayDialogSummary day={day} {...stats} />
		</Dialog>
	);
};

function getDayVoteForHabit(
	getDayVotesRequestState: Async.AsyncState<IDayVote[]>,
	habit: IHabit,
): Vote | undefined {
	const dayVotes = getDayVotesRequestState.data ?? [];
	return dayVotes.find(vote => vote.habit_id === habit.id)?.vote;
}
