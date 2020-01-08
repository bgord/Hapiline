import {Dialog} from "@reach/dialog";
import {useHistory} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {CloseButton} from "./CloseButton";
import {DayDialogHabitVoteListItem} from "./DayDialogHabitVoteListItem";
import {DayDialogSummary} from "./DayDialogSummary";
import {DayVoteStats} from "./interfaces/IMonthDay";
import {IDayVote, Vote} from "./interfaces/IDayVote";
import {IHabit} from "./interfaces/IHabit";
import {SuccessMessage} from "./SuccessMessages";
import {api} from "./services/api";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {useErrorNotification} from "./contexts/notifications-context";
import {useHabitSearch} from "./hooks/useHabitSearch";
import {useHabits} from "./contexts/habits-context";

type DayDialogProps = DayVoteStats & {
	refreshCalendar: VoidFunction;
};

type HabitVote = {
	habit: IHabit;
	vote: Vote | undefined;
	day: string;
};

type FilterTypes = "all" | "unvoted" | "voted";

const filterToFunction: {[key in FilterTypes]: (habitVote: HabitVote) => boolean} = {
	all: () => true,
	unvoted: ({vote}) => !vote,
	voted: ({vote}) => vote !== null && vote !== undefined,
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
	const [filter, setFilter] = React.useState<FilterTypes>("all");
	const habitSearch = useHabitSearch();

	const habitsAvailableAtThisDay = getHabitsAvailableAtThisDay(habits, day);

	const habitVotes: HabitVote[] = habitsAvailableAtThisDay.map(habit => ({
		habit,
		vote: getDayVoteForHabit(getDayVotesRequestState, habit),
		day,
	}));

	const areAnyHabitsAvailable = habitsAvailableAtThisDay.length === 0;

	const howManyHabitsAtAll = habitVotes.length;
	const howManyUnvotedHabits = habitVotes.filter(({vote}) => !vote).length;
	const howManyVotedHabits = habitVotes.filter(({vote}) => vote).length;

	const doesEveryHabitHasAVote = howManyUnvotedHabits === 0 && howManyHabitsAtAll > 0;

	function dismissDialog() {
		history.push("/calendar");
	}

	function onFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
		const {value} = event.target;
		if (isFilter(value)) {
			setFilter(value);
		}
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
			{doesEveryHabitHasAVote && (
				<SuccessMessage>
					Congratulations! You've voted for every habit{" "}
					<span role="img" aria-label="Party emoji">
						🎉
					</span>
				</SuccessMessage>
			)}
			<div className="flex my-8">
				<input
					name="filter"
					id="all"
					type="radio"
					value="all"
					checked={filter === "all"}
					onChange={onFilterChange}
					className="mr-1"
				/>
				<label htmlFor="all">Show all ({howManyHabitsAtAll})</label>

				<input
					name="filter"
					id="voted"
					type="radio"
					value="voted"
					checked={filter === "voted"}
					onChange={onFilterChange}
					className="mr-1 ml-8"
				/>
				<label htmlFor="voted">Show voted ({howManyVotedHabits})</label>

				<input
					name="filter"
					id="unvoted"
					type="radio"
					value="unvoted"
					checked={filter === "unvoted"}
					onChange={onFilterChange}
					className="mr-1 ml-8"
				/>
				<label htmlFor="unvoted">Show unvoted ({howManyUnvotedHabits})</label>
				<BareButton
					onClick={() => {
						setFilter("all");
						habitSearch.clearPhrase();
					}}
					className="ml-auto"
				>
					Reset filters
				</BareButton>
			</div>
			<div className="mb-6">
				<input
					className="field p-1 w-64"
					type="search"
					value={habitSearch.phrase}
					onChange={event => habitSearch.setPhrase(event.target.value)}
					placeholder="Search for habits..."
				/>
				<BareButton onClick={habitSearch.clearPhrase}>Clear</BareButton>
			</div>
			{areAnyHabitsAvailable && <div>No habits available this day.</div>}
			<ul data-testid="day-dialog-habits">
				{habitVotes
					.filter(filterToFunction[filter])
					.filter(entry => habitSearch.filterFn(entry.habit))
					.map(entry => (
						<DayDialogHabitVoteListItem
							key={entry.habit.id}
							onResolve={() => {
								refreshCalendar();
								getDayVotesRequestState.reload();
							}}
							{...entry}
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

function isFilter(value: string): value is FilterTypes {
	const FILTER_TYPES = ["all", "voted", "unvoted"];
	return FILTER_TYPES.includes(value);
}
