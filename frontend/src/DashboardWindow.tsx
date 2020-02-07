import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";
import deepEqual from "fast-deep-equal";

import {BareButton} from "./BareButton";
import {DayDialog} from "./DayDialog";
import {DaySummaryChart, DaySummaryStats} from "./DayDialogSummary";
import {ErrorMessage} from "./ErrorMessages";
import {Loader} from "./Loader";
import {api} from "./services/api";
import {constructUrl, useQueryParams} from "./hooks/useQueryParam";
import {formatToday} from "./config/DATE_FORMATS";
import {useErrorNotification} from "./contexts/notifications-context";

export const DashboardWindow = () => {
	const [{subview}, updateQueryParams] = useQueryParams();
	const triggerErrorNotification = useErrorNotification();

	const getDashboardStatsRequestState = Async.useAsync({
		promiseFn: api.stats.dashboard,
		onReject: () => triggerErrorNotification("Couldn't fetch dashboard stats."),
	});

	const getDashboardStreakStatsRequestState = Async.useAsync({
		promiseFn: api.stats.dashboardStreak,
		onReject: () => triggerErrorNotification("Couldn't fetch dashboard streak stats."),
	});

	const progressStreakStats = getDashboardStreakStatsRequestState.data?.progress_streaks ?? [];
	const regressStreakStats = getDashboardStreakStatsRequestState.data?.regress_streaks ?? [];

	const todayStats = getDashboardStatsRequestState?.data?.today;
	const lastWeekStats = getDashboardStatsRequestState?.data?.lastWeek;
	const lastMonthStats = getDashboardStatsRequestState?.data?.lastMonth;

	const howManyHabitsToday = todayStats?.maximumVotes ?? 0;
	const howManyUntrackedHabitsToday = todayStats?.untrackedHabits ?? 0;
	const howManyVotesToday = todayStats?.allVotes ?? 0;

	const statsForToday = {
		progressVotesCountStats: todayStats?.progressVotes ?? 0,
		plateauVotesCountStats: todayStats?.plateauVotes ?? 0,
		regressVotesCountStats: todayStats?.regressVotes ?? 0,
		noVotesCountStats: todayStats?.noVotes ?? 0,
	};

	const statsForLastWeek = {
		progressVotesCountStats: lastWeekStats?.progressVotes ?? 0,
		plateauVotesCountStats: lastWeekStats?.plateauVotes ?? 0,
		regressVotesCountStats: lastWeekStats?.regressVotes ?? 0,
		noVotesCountStats: lastWeekStats?.noVotes ?? 0,
	};

	const statsForLastMonth = {
		progressVotesCountStats: lastMonthStats?.progressVotes ?? 0,
		plateauVotesCountStats: lastMonthStats?.plateauVotes ?? 0,
		regressVotesCountStats: lastMonthStats?.regressVotes ?? 0,
		noVotesCountStats: lastMonthStats?.noVotes ?? 0,
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
					<MotivationalText
						untracked={howManyUntrackedHabitsToday}
						total={howManyHabitsToday}
						votedFor={howManyVotesToday}
					/>
				</p>
				{howManyHabitsToday > 0 && (
					<div data-testid="chart-today">
						<div className="uppercase text-sm font-bold text-gray-600">Votes today</div>
						<div className="flex items-center mb-8">
							<DaySummaryChart
								maximumVotes={todayStats?.maximumVotes ?? 0}
								className="h-4"
								day={currentDate}
								{...statsForToday}
							/>
							<DaySummaryStats day={currentDate} {...statsForToday} />
						</div>
					</div>
				)}
				{howManyHabitsToday > 0 && !deepEqual(statsForToday, statsForLastWeek) && (
					<div data-testid="chart-last-week">
						<div className="uppercase text-sm font-bold text-gray-600">Votes last week</div>
						<div className="flex items-center mb-8">
							<DaySummaryChart
								maximumVotes={lastWeekStats?.maximumVotes ?? 0}
								className="h-4"
								day={currentDate}
								{...statsForLastWeek}
							/>
							<DaySummaryStats day={currentDate} {...statsForLastWeek} />
						</div>
					</div>
				)}
				{howManyHabitsToday > 0 && !deepEqual(statsForLastWeek, statsForLastMonth) && (
					<div data-testid="chart-last-month">
						<div className="uppercase text-sm font-bold text-gray-600">Votes last month</div>
						<div className="flex items-center">
							<DaySummaryChart
								maximumVotes={lastMonthStats?.maximumVotes ?? 0}
								className="h-4"
								day={currentDate}
								{...statsForLastMonth}
							/>
							<DaySummaryStats day={currentDate} {...statsForLastMonth} />
						</div>
					</div>
				)}
			</Async.IfFulfilled>
			<Async.IfPending state={getDashboardStreakStatsRequestState}>
				<Loader />
			</Async.IfPending>
			<Async.IfFulfilled state={getDashboardStreakStatsRequestState}>
				{progressStreakStats.length > 0 && (
					<>
						<strong className="mt-12">Progress streaks</strong>
						<ul>
							{progressStreakStats.map(habit => (
								<li key={habit.id}>
									{habit.progress_streak} day(s) progress streak -{" "}
									<Link to={constructUrl("habits", {preview_habit_id: habit.id.toString()})}>
										{habit.name}
									</Link>
								</li>
							))}
						</ul>
					</>
				)}
				{regressStreakStats.length > 0 && (
					<>
						<strong className="mt-4">Regress streaks</strong>
						<ul className="mb-6">
							{regressStreakStats.map(habit => (
								<li key={habit.id}>
									{habit.regress_streak} day(s) regress streak -{" "}
									<Link to={constructUrl("habits", {preview_habit_id: habit.id.toString()})}>
										{habit.name}
									</Link>
								</li>
							))}
						</ul>
					</>
				)}
			</Async.IfFulfilled>
			{subview === "day_preview" && (
				<DayDialog
					day={currentDate}
					onDismiss={() => updateQueryParams("/dashboard", {})}
					onResolve={getDashboardStatsRequestState.reload}
					{...statsForToday}
				/>
			)}
		</section>
	);
};

const MotivationalText: React.FC<{total: number; votedFor: number; untracked: number}> = ({
	total,
	votedFor,
	untracked,
}) => {
	if (total === 0 && votedFor === 0) {
		return (
			<Link className="link" to="habits">
				Add your first tracked habit to start voting!
			</Link>
		);
	}
	if (votedFor === 0) {
		return (
			<>
				Start your day well! You have <strong>{total}</strong> tracked habits to vote for. And{" "}
				{untracked} untracked habits.
			</>
		);
	}
	if (votedFor > 0 && votedFor < total) {
		return (
			<>
				You're on a good track! You have <strong>{total - votedFor}</strong> tracked habits to vote
				for left out of <strong>{total}</strong>. And {untracked} untracked habits.
			</>
		);
	}
	if (votedFor === total) {
		return (
			<>
				<strong>Congratulations!</strong> You voted for every one of {total} tracked habits today!
				You also have {untracked} untracked habits.
			</>
		);
	}
	return null;
};
