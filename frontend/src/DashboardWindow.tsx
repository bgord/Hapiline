import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";
import deepEqual from "fast-deep-equal";

import {Button} from "./ui/button/Button";
import {Column} from "./ui/column/Column";
import {DayDialog} from "./DayDialog";
import {DaySummaryChart, DaySummaryStats} from "./DayDialogSummary";
import {Divider} from "./ui/divider/Divider";
import {ErrorMessage} from "./ErrorMessages";
import {Header} from "./ui/header/Header";
import {Loader} from "./Loader";
import {Row} from "./ui/row/Row";
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
		<Column style={{maxWidth: "750px", margin: "48px auto 0 auto"}}>
			<Row>
				<Header variant="large">Hello!</Header>
				<Button ml="auto" variant="primary" onClick={redirectToCurrentDay}>
					View today
				</Button>
			</Row>
			<Async.IfRejected state={getDashboardStatsRequestState}>
				<ErrorMessage className="mt-8">
					Cannot load dashboard stats now, please try again.
				</ErrorMessage>
			</Async.IfRejected>
			<Async.IfFulfilled state={getDashboardStatsRequestState}>
				<Row mt="48" mb="48">
					<MotivationalText
						untracked={howManyUntrackedHabitsToday}
						total={howManyHabitsToday}
						votedFor={howManyVotesToday}
					/>
				</Row>
				{howManyHabitsToday > 0 && (
					<Column data-testid="chart-today">
						<Text variant="dimmed">Votes today</Text>
						<Row mb="48">
							<DaySummaryChart
								maximumVotes={todayStats?.maximumVotes ?? 0}
								className="h-4"
								day={currentDate}
								{...statsForToday}
							/>
							<DaySummaryStats day={currentDate} {...statsForToday} />
						</Row>
					</Column>
				)}
				{howManyHabitsToday > 0 && !deepEqual(statsForToday, statsForLastWeek) && (
					<Column data-testid="chart-last-week">
						<Text variant="dimmed">Votes last week</Text>
						<Row mb="48">
							<DaySummaryChart
								maximumVotes={lastWeekStats?.maximumVotes ?? 0}
								className="h-4"
								day={currentDate}
								{...statsForLastWeek}
							/>
							<DaySummaryStats day={currentDate} {...statsForLastWeek} />
						</Row>
					</Column>
				)}
				{howManyHabitsToday > 0 && !deepEqual(statsForLastWeek, statsForLastMonth) && (
					<Column data-testid="chart-last-month">
						<Text variant="dimmed">Votes last month</Text>
						<Row mb="48">
							<DaySummaryChart
								maximumVotes={lastMonthStats?.maximumVotes ?? 0}
								className="h-4"
								day={currentDate}
								{...statsForLastMonth}
							/>
							<DaySummaryStats day={currentDate} {...statsForLastMonth} />
						</Row>
					</Column>
				)}
			</Async.IfFulfilled>
			<Async.IfPending state={getDashboardStreakStatsRequestState}>
				<Loader />
			</Async.IfPending>
			<Async.IfFulfilled state={getDashboardStreakStatsRequestState}>
				{progressStreakStats.length > 0 && (
					<>
						<Divider mt="24" />
						<Header mt="24" mb="48" variant="extra-small">
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
						<Divider mt="24" />
						<Header mt="24" mb="48" variant="extra-small">
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
		</Column>
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
