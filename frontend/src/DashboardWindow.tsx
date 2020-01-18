import {format} from "date-fns";
import {useHistory, Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {DaySummaryChart} from "./DayDialogSummary";
import {ErrorMessage} from "./ErrorMessages";
import {api} from "./services/api";
import {useErrorNotification} from "./contexts/notifications-context";
import {useHabits, useHabitsState} from "./contexts/habits-context";

export const DashboardWindow = () => {
	const getHabitsRequestState = useHabitsState();
	const habits = useHabits();
	const history = useHistory();
	const triggerErrorNotification = useErrorNotification();

	const today = new Date();
	const currentDate = format(today, "yyyy-MM-dd");

	const getDayVotesRequestState = Async.useAsync({
		promiseFn: api.calendar.getDay,
		day: currentDate,
		onReject: () => triggerErrorNotification("Couldn't fetch habit votes."),
	});

	const howManyHabitsToday = habits.length;
	const howManyVotesToday = getDayVotesRequestState.data?.length ?? 0;

	const howManyProgressVotes =
		getDayVotesRequestState.data?.filter(vote => vote.vote === "progress").length ?? 0;
	const howManyPlateauVotes =
		getDayVotesRequestState.data?.filter(vote => vote.vote === "plateau").length ?? 0;
	const howManyRegressVotes =
		getDayVotesRequestState.data?.filter(vote => vote.vote === "regress").length ?? 0;

	const stats = {
		progressVotesCountStats: howManyProgressVotes,
		plateauVotesCountStats: howManyPlateauVotes,
		regressVotesCountStats: howManyRegressVotes,
		noVotesCountStats: howManyHabitsToday - howManyVotesToday,
	};

	const dayVotesError = getDayVotesRequestState.isRejected;
	const habitsError = getHabitsRequestState.isRejected;

	return (
		<section className="flex flex-col max-w-2xl mx-auto mt-12">
			<header className="flex w-full">
				<h1 className="text-xl font-bold">Hello!</h1>
				<BareButton
					onClick={() =>
						history.push(`/calendar?previewDay=${currentDate}&habit_vote_filter=unvoted`)
					}
					className="ml-auto bg-blue-300"
				>
					View today
				</BareButton>
			</header>
			<ErrorMessage className="mt-8" hidden={!(dayVotesError && habitsError)}>
				Cannot load dashboard stats now, try again.
			</ErrorMessage>
			<main hidden={dayVotesError || habitsError}>
				<Async.IfFulfilled state={getDayVotesRequestState}>
					<p className="my-8">
						<MotivationalText total={howManyHabitsToday} votedFor={howManyVotesToday} />
					</p>
					{habits.length > 0 && (
						<>
							<div className="uppercase text-sm font-bold text-gray-600">Votes today</div>
							<DaySummaryChart className="mt-2" day={currentDate} {...stats} />
						</>
					)}
				</Async.IfFulfilled>
			</main>
		</section>
	);
};

const MotivationalText: React.FC<{total: number; votedFor: number}> = ({total, votedFor}) => {
	if (total === 0 && votedFor === 0) {
		return (
			<Link className="link" to="habits">
				Add your first habit to start voting!
			</Link>
		);
	}
	if (votedFor === 0) {
		return (
			<>
				Start your day well! You have <strong>{total}</strong> habits to vote for.
			</>
		);
	}
	if (votedFor > 0 && votedFor < total) {
		return (
			<>
				You're on a good track! You have <strong>{total - votedFor}</strong> habits to vote for left
				out of <strong>{total}</strong>.
			</>
		);
	}
	if (votedFor === total) {
		return (
			<>
				<strong>Congratulations!</strong> You voted for every one of {total} habits today!
			</>
		);
	}
	return null;
};
