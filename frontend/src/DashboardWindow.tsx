import {Link} from "react-router-dom";
import {useQuery} from "react-query";
import React from "react";
import deepEqual from "fast-deep-equal";

import {DayDialog} from "./DayDialog";
import {DaySummaryChart} from "./DayDialogSummary";
import {ExpandContractList} from "./ui/ExpandContractList";
import {HabitItemDialog} from "./HabitItemDialog";
import {api} from "./services/api";
import {constructUrl, useQueryParams} from "./hooks/useQueryParam";
import {formatToday} from "./config/DATE_FORMATS";
import {pluralize} from "./services/pluralize";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {useErrorToast} from "./contexts/toasts-context";
import {DashboardStreakStats, DashboardHabitVoteStatsForDateRanges} from "./interfaces/index";
import * as UI from "./ui";

export const DashboardWindow = () => {
	useDocumentTitle("Hapiline - dashboard");
	const [{subview, preview_habit_id}, updateQueryParams] = useQueryParams();
	const triggerErrorNotification = useErrorToast();

	const getDashboardStatsRequestState = useQuery<
		DashboardHabitVoteStatsForDateRanges,
		"dashboard_stats"
	>({
		queryKey: "dashboard_stats",
		queryFn: api.stats.dashboard,
		config: {
			onError: () => triggerErrorNotification("Couldn't fetch dashboard stats."),
			retry: false,
		},
	});

	const getDashboardStreakStatsRequestState = useQuery<
		DashboardStreakStats,
		"dashboard_streak_stats"
	>({
		queryKey: "dashboard_streak_stats",
		queryFn: api.stats.dashboardStreak,
		config: {
			onError: () => triggerErrorNotification("Couldn't fetch dashboard streak stats."),
			retry: false,
		},
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
		<UI.Card pt="12" mx="auto" mt="48" mb="24" style={{maxWidth: "var(--view-width)"}}>
			<UI.Row bg="gray-1" p="24" mainAxis="between">
				<UI.Header variant="large">Hello!</UI.Header>
				<UI.Button variant="primary" onClick={redirectToCurrentDay}>
					View today
				</UI.Button>
			</UI.Row>
			<UI.Column p="24">
				{getDashboardStatsRequestState.status === "error" && (
					<UI.ErrorBanner mt="24">
						Cannot load dashboard stats now, please try again.
					</UI.ErrorBanner>
				)}

				{getDashboardStatsRequestState.status === "success" && (
					<>
						<UI.Row mt="24" mb="48">
							<MotivationalText
								untracked={howManyUntrackedHabitsToday}
								total={howManyHabitsToday}
								votedFor={howManyVotesToday}
							/>
						</UI.Row>
						{howManyHabitsToday > 0 && (
							<UI.Column data-testid="chart-today">
								<UI.Text variant="dimmed">Votes today</UI.Text>
								<UI.Row mb="24">
									<DaySummaryChart
										maximumVotes={todayStats?.maximumVotes ?? 0}
										day={currentDate}
										{...statsForToday}
									/>
								</UI.Row>
							</UI.Column>
						)}
						{howManyHabitsToday > 0 && !deepEqual(statsForToday, statsForLastWeek) && (
							<UI.Column data-testid="chart-last-week">
								<UI.Text variant="dimmed">Votes last week</UI.Text>
								<UI.Row mb="24">
									<DaySummaryChart
										maximumVotes={lastWeekStats?.maximumVotes ?? 0}
										day={currentDate}
										{...statsForLastWeek}
									/>
								</UI.Row>
							</UI.Column>
						)}
						{howManyHabitsToday > 0 && !deepEqual(statsForLastWeek, statsForLastMonth) && (
							<UI.Column data-testid="chart-last-month">
								<UI.Text variant="dimmed">Votes last month</UI.Text>
								<UI.Row mb="24">
									<DaySummaryChart
										maximumVotes={lastMonthStats?.maximumVotes ?? 0}
										day={currentDate}
										{...statsForLastMonth}
									/>
								</UI.Row>
							</UI.Column>
						)}
					</>
				)}

				{getDashboardStreakStatsRequestState.status === "loading" && <UI.Text>Loading...</UI.Text>}

				{getDashboardStreakStatsRequestState.status === "success" && (
					<>
						{regressStreakStats.length > 0 && (
							<>
								<UI.Row mt="24" mb="24" crossAxis="center">
									<UI.Header variant="extra-small">Regress streaks</UI.Header>
									<UI.Badge style={{padding: "0 3px"}} ml="6" variant="neutral">
										{regressStreakStats.length}
									</UI.Badge>
								</UI.Row>
								<UI.Column by="gray-1">
									<ExpandContractList max={5}>
										{regressStreakStats.map(habit => (
											<UI.Row py="12" by="gray-1" key={habit.id} mainAxis="between">
												<Link
													to={constructUrl("dashboard", {
														subview: "habit_preview",
														preview_habit_id: habit.id.toString(),
													})}
												>
													<UI.Text>{habit.name}</UI.Text>
												</Link>
												<UI.Badge variant="negative">
													{habit.regress_streak} {pluralize("day", habit.regress_streak)} regress
													streak
												</UI.Badge>
											</UI.Row>
										))}
									</ExpandContractList>
								</UI.Column>
							</>
						)}
						{progressStreakStats.length > 0 && (
							<>
								<UI.Row mt="48" mb="24" crossAxis="center">
									<UI.Header variant="extra-small">Progress streaks</UI.Header>
									<UI.Badge style={{padding: "0 3px"}} ml="6" variant="neutral">
										{progressStreakStats.length}
									</UI.Badge>
								</UI.Row>
								<UI.Column bt="gray-1">
									<ExpandContractList max={5}>
										{progressStreakStats.map(habit => (
											<UI.Row py="12" by="gray-1" key={habit.id} mainAxis="between">
												<Link
													to={constructUrl("dashboard", {
														subview: "habit_preview",
														preview_habit_id: habit.id.toString(),
													})}
												>
													<UI.Text>{habit.name}</UI.Text>
												</Link>
												<UI.Badge variant="positive">
													{habit.progress_streak} {pluralize("day", habit.progress_streak)} progress
													streak
												</UI.Badge>
											</UI.Row>
										))}
									</ExpandContractList>
								</UI.Column>
							</>
						)}
					</>
				)}
				{subview === "day_preview" && (
					<DayDialog
						day={currentDate}
						onResolve={getDashboardStatsRequestState.refetch}
						{...statsForToday}
					/>
				)}
				{subview === "habit_preview" && !isNaN(Number(preview_habit_id)) && (
					<HabitItemDialog
						habitId={Number(preview_habit_id)}
						closeDialog={() => updateQueryParams("dashboard", {})}
					/>
				)}
			</UI.Column>
		</UI.Card>
	);
};

const MotivationalText: React.FC<{total: number; votedFor: number; untracked: number}> = ({
	total,
	votedFor,
	untracked,
}) => {
	if (total === 0 && votedFor === 0) {
		return (
			<Link className="c-link" to="habits">
				Add your first tracked habit to start voting!
			</Link>
		);
	}
	if (votedFor === 0) {
		return (
			<UI.Text>
				Start your day well! You have <UI.Text variant="bold">{total}</UI.Text> tracked habits to
				vote for. And {untracked} untracked habits.
			</UI.Text>
		);
	}
	if (votedFor > 0 && votedFor < total) {
		return (
			<UI.Column>
				<UI.Text>You're on a good track!</UI.Text>
				<UI.Text>
					You have <UI.Text variant="bold">{total - votedFor}</UI.Text> tracked habits to vote for
					left out of <UI.Text variant="bold">{total}</UI.Text> (and {untracked} untracked habits).
				</UI.Text>
			</UI.Column>
		);
	}
	if (votedFor === total) {
		return (
			<UI.Column>
				<UI.Row>
					<UI.Text variant="bold">Congratulations! </UI.Text>
					<UI.Text ml="6">
						You voted for every one of <UI.Text variant="bold">{total}</UI.Text> tracked habits
						today!
					</UI.Text>
				</UI.Row>
				<UI.Text> You also have {untracked} untracked habits.</UI.Text>
			</UI.Column>
		);
	}
	return null;
};
