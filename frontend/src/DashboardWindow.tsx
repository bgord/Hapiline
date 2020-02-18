import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";
import deepEqual from "fast-deep-equal";

import {Button} from "./ui/button/Button";
import {DayDialog} from "./DayDialog";
import {DaySummaryChart, DaySummaryStats} from "./DayDialogSummary";
import {Divider} from "./ui/divider/Divider";
import {ErrorMessage} from "./ErrorMessages";
import {Header} from "./ui/header/Header";
import {Loader} from "./Loader";
import {Text} from "./ui/text/Text";
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
			<header className="flex items-center w-full">
				<Header variant="large">Hello!</Header>
				<Button variant="primary" onClick={redirectToCurrentDay} style={{marginLeft: "auto"}}>
					View today
				</Button>
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
						<Divider style={{marginTop: "24px"}} />
						<Header variant="extra-small" style={{marginTop: "24px", marginBottom: "36px"}}>
							Progress streaks
						</Header>
						<ul>
							{progressStreakStats.map(habit => (
								<li key={habit.id}>
									<Text>{habit.progress_streak} day(s) progress streak - </Text>
									<Link to={constructUrl("habits", {preview_habit_id: habit.id.toString()})}>
										<Text>{habit.name}</Text>
									</Link>
								</li>
							))}
						</ul>
					</>
				)}
				{regressStreakStats.length > 0 && (
					<>
						<Divider style={{marginTop: "24px"}} />
						<Header variant="extra-small" style={{marginTop: "24px", marginBottom: "36px"}}>
							Regress streaks
						</Header>
						<ul className="mb-6">
							{regressStreakStats.map(habit => (
								<li key={habit.id}>
									<Text>{habit.regress_streak} day(s) regress streak - </Text>
									<Link to={constructUrl("habits", {preview_habit_id: habit.id.toString()})}>
										<Text>{habit.name}</Text>
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
			<Text>
				Start your day well! You have <Text variant="bold">{total}</Text> tracked habits to vote
				for. And {untracked} untracked habits.
			</Text>
		);
	}
	if (votedFor > 0 && votedFor < total) {
		return (
			<Text>
				You're on a good track!
				<br />
				You have <Text variant="bold">{total - votedFor}</Text> tracked habits to vote for left out
				of <Text variant="bold">{total}</Text> (and {untracked} untracked habits).
			</Text>
		);
	}
	if (votedFor === total) {
		return (
			<Text>
				<Text variant="bold">Congratulations! </Text>
				You voted for every one of <Text variant="bold">{total}</Text> tracked habits today!
				<br /> You also have {untracked} untracked habits.
			</Text>
		);
	}
	return null;
};
