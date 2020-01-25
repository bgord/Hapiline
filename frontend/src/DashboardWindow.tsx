import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {DayDialog} from "./DayDialog";
import {DaySummaryChart, DaySummaryStats} from "./DayDialogSummary";
import {ErrorMessage} from "./ErrorMessages";
import {api} from "./services/api";
import {formatToday} from "./config/DATE_FORMATS";
import {useErrorNotification} from "./contexts/notifications-context";
import {useQueryParams} from "./hooks/useQueryParam";

export const DashboardWindow = () => {
	const [{subview}, updateQueryParams] = useQueryParams();
	const triggerErrorNotification = useErrorNotification();

	const getDashboardStatsRequestState = Async.useAsync({
		promiseFn: api.stats.dashboard,
		onReject: () => triggerErrorNotification("Couldn't fetch dashboard stats."),
	});

	const todayStats = getDashboardStatsRequestState?.data?.today;

	const howManyHabitsToday = todayStats?.allHabits ?? 0;
	const howManyVotesToday = todayStats?.allVotes ?? 0;

	const stats = {
		progressVotesCountStats: todayStats?.progressVotes ?? 0,
		plateauVotesCountStats: todayStats?.plateauVotes ?? 0,
		regressVotesCountStats: todayStats?.regressVotes ?? 0,
		noVotesCountStats: todayStats?.noVotes ?? 0,
	};

	const currentDate = formatToday();

	const redirectToCurrentDay = () =>
		updateQueryParams("dashboard", {
			subview: "day_preview",
			preview_day: currentDate,
			habit_vote_filter: "unvoted",
		});

	return (
		<section className="flex flex-col max-w-2xl mx-auto mt-12">
			<header className="flex items-baseline w-full">
				<h1 className="text-xl font-bold">Hello!</h1>
				<BareButton onClick={redirectToCurrentDay} className="ml-auto bg-blue-300 p-1">
					View today
				</BareButton>
			</header>
			<Async.IfRejected state={getDashboardStatsRequestState}>
				<ErrorMessage className="mt-8">
					Cannot load dashboard stats now, please try again.
				</ErrorMessage>
			</Async.IfRejected>
			<Async.IfFulfilled state={getDashboardStatsRequestState}>
				<p className="my-8">
					<MotivationalText total={howManyHabitsToday} votedFor={howManyVotesToday} />
				</p>
				{howManyHabitsToday > 0 && (
					<>
						<div className="uppercase text-sm font-bold text-gray-600">Votes today</div>
						<div className="flex items-center mt-3">
							<DaySummaryChart className="h-4" day={currentDate} {...stats} />
							<DaySummaryStats day={currentDate} {...stats} />
						</div>
					</>
				)}
			</Async.IfFulfilled>
			{subview === "day_preview" && (
				<DayDialog
					day={currentDate}
					onDismiss={() => updateQueryParams("/dashboard", {})}
					onResolve={getDashboardStatsRequestState.reload}
					{...stats}
				/>
			)}
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
