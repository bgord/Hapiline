import {Link} from "react-router-dom";
import * as Async from "react-async";
import React from "react";
import deepEqual from "fast-deep-equal";

import {Button, Row, Text, Column, Header, Card, ErrorBanner, Badge} from "./ui";
import {DayDialog} from "./DayDialog";
import {DaySummaryChart} from "./DayDialogSummary";
import {api} from "./services/api";
import {constructUrl, useQueryParams} from "./hooks/useQueryParam";
import {formatToday} from "./config/DATE_FORMATS";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {useErrorNotification} from "./contexts/notifications-context";

export const DashboardWindow = () => {
	useDocumentTitle("Hapiline - dashboard");
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
		<Card pt="12" mx="auto" mt="48" mb="24" style={{maxWidth: "750px"}}>
			<Row p="24" mainAxis="between" style={{background: "var(--gray-1)"}}>
				<Header variant="large">Hello!</Header>
				<Button variant="primary" onClick={redirectToCurrentDay}>
					View today
				</Button>
			</Row>
			<Column p="24">
				<Async.IfRejected state={getDashboardStatsRequestState}>
					<ErrorBanner p="6" mt="24">
						Cannot load dashboard stats now, please try again.
					</ErrorBanner>
				</Async.IfRejected>
				<Async.IfFulfilled state={getDashboardStatsRequestState}>
					<Row mt="24" mb="48">
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
									day={currentDate}
									{...statsForToday}
								/>
							</Row>
						</Column>
					)}
					{howManyHabitsToday > 0 && !deepEqual(statsForToday, statsForLastWeek) && (
						<Column data-testid="chart-last-week">
							<Text variant="dimmed">Votes last week</Text>
							<Row mb="48">
								<DaySummaryChart
									maximumVotes={lastWeekStats?.maximumVotes ?? 0}
									day={currentDate}
									{...statsForLastWeek}
								/>
							</Row>
						</Column>
					)}
					{howManyHabitsToday > 0 && !deepEqual(statsForLastWeek, statsForLastMonth) && (
						<Column data-testid="chart-last-month">
							<Text variant="dimmed">Votes last month</Text>
							<Row mb="48">
								<DaySummaryChart
									maximumVotes={lastMonthStats?.maximumVotes ?? 0}
									day={currentDate}
									{...statsForLastMonth}
								/>
							</Row>
						</Column>
					)}
				</Async.IfFulfilled>
				<Async.IfPending state={getDashboardStreakStatsRequestState}>
					<Text>Loading...</Text>
				</Async.IfPending>
				<Async.IfFulfilled state={getDashboardStreakStatsRequestState}>
					{regressStreakStats.length > 0 && (
						<>
							<Header mt="24" mb="24" variant="extra-small">
								Regress streaks
							</Header>
							<Column
								style={{
									borderTop: "1px solid var(--gray-1)",
									borderBottom: "1px solid var(--gray-1)",
								}}
							>
								{regressStreakStats.map(habit => (
									<Row
										py="12"
										style={{
											borderTop: "1px solid var(--gray-1)",
											borderBottom: "1px solid var(--gray-1)",
										}}
										key={habit.id}
										mainAxis="between"
									>
										<Link to={constructUrl("habits", {preview_habit_id: habit.id.toString()})}>
											<Text>{habit.name}</Text>
										</Link>
										<Badge variant="negative">{`${habit.regress_streak} day${
											habit.regress_streak > 1 ? "s" : ""
										} regress streak`}</Badge>
									</Row>
								))}
							</Column>
						</>
					)}
					{progressStreakStats.length > 0 && (
						<>
							<Header mt="24" mb="24" variant="extra-small">
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
				</Async.IfFulfilled>
				{subview === "day_preview" && (
					<DayDialog
						day={currentDate}
						onResolve={getDashboardStatsRequestState.reload}
						{...statsForToday}
					/>
				)}
			</Column>
		</Card>
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
			<Column>
				<Text>You're on a good track!</Text>
				<Text>
					You have <Text variant="bold">{total - votedFor}</Text> tracked habits to vote for left
					out of <Text variant="bold">{total}</Text> (and {untracked} untracked habits).
				</Text>
			</Column>
		);
	}
	if (votedFor === total) {
		return (
			<Column>
				<Row>
					<Text variant="bold">Congratulations! </Text>
					<Text ml="6">
						You voted for every one of <Text variant="bold">{total}</Text> tracked habits today!
					</Text>
				</Row>
				<Text> You also have {untracked} untracked habits.</Text>
			</Column>
		);
	}
	return null;
};
