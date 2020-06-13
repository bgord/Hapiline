import {useQuery} from "react-query";
import React from "react";
import deepEqual from "fast-deep-equal";

import {DayDialog} from "../../DayDialog";
import {DaySummaryChart} from "../../DayDialogSummary";
import {HabitItemDialog} from "../../HabitItemDialog";
import {api} from "../../services/api";
import {useQueryParams} from "../../hooks/useQueryParam";
import {formatToday} from "../../services/date-formatter";
import {useDocumentTitle} from "../../hooks/useDocumentTitle";
import {useErrorToast} from "../../contexts/toasts-context";
import {DashboardStreakStats, DashboardHabitVoteStatsForDateRanges} from "../../models";
import {UrlBuilder} from "../../services/url-builder";
import * as UI from "../../ui";

import {MotivationalText} from "./DashboardMotivationalText";
import {DashboardRegressStreakList} from "./DashboardRegressStreakList";
import {DashboardNoStreakList} from "./DashboardNoStreakList";
import {DashboardProgressStreakList} from "./DashboardProgressStreakList";

export const DashboardWindow = () => {
	useDocumentTitle("Hapiline - dashboard");
	const [{subview, preview_habit_id}, updateQueryParams, updateUrl] = useQueryParams();
	const triggerErrorToast = useErrorToast();

	const getDashboardStatsRequestState = useQuery<
		DashboardHabitVoteStatsForDateRanges,
		"dashboard_stats"
	>({
		queryKey: "dashboard_stats",
		queryFn: api.stats.dashboard,
		config: {
			onError: () => triggerErrorToast("Couldn't fetch dashboard stats."),
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
			onError: () => triggerErrorToast("Couldn't fetch dashboard streak stats."),
			retry: false,
		},
	});

	const todayStats = getDashboardStatsRequestState?.data?.today;
	const lastWeekStats = getDashboardStatsRequestState?.data?.lastWeek;
	const lastMonthStats = getDashboardStatsRequestState?.data?.lastMonth;

	// TODO: Try to find a way to avoid ?? 0 statements.
	const howManyHabitsToday = todayStats?.maximumVotes ?? 0;
	const howManyUntrackedHabitsToday = todayStats?.untrackedHabits ?? 0;
	const howManyVotesToday = todayStats?.allVotes ?? 0;

	// TODO: Try to find a way to avoid ?? 0 statements.
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

	return (
		<UI.Card pt="12" mx="auto" mt="48" mb="24" style={{maxWidth: "var(--view-width)"}}>
			<UI.Row bg="gray-1" p="24" mainAxis="between">
				<UI.Header variant="large">Hello!</UI.Header>

				<UI.Button
					variant="primary"
					onClick={() => updateUrl(UrlBuilder.dashboard.calendar.today())}
				>
					View today
				</UI.Button>
			</UI.Row>

			<UI.Column p="24">
				<UI.ShowIf request={getDashboardStatsRequestState} is="error">
					<UI.ErrorBanner mt="24">
						Cannot load dashboard stats now, please try again.
					</UI.ErrorBanner>
				</UI.ShowIf>

				<UI.ShowIf request={getDashboardStatsRequestState} is="success">
					<MotivationalText
						untracked={howManyUntrackedHabitsToday}
						total={howManyHabitsToday}
						votedFor={howManyVotesToday}
					/>

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
				</UI.ShowIf>

				<UI.ShowIf request={getDashboardStatsRequestState} is="loading">
					<UI.Text>Loading...</UI.Text>
				</UI.ShowIf>

				<UI.ShowIf request={getDashboardStatsRequestState} is="success">
					<DashboardRegressStreakList request={getDashboardStreakStatsRequestState} />
					<DashboardProgressStreakList request={getDashboardStreakStatsRequestState} />
					<DashboardNoStreakList request={getDashboardStreakStatsRequestState} />
				</UI.ShowIf>

				{subview === "day_preview" && (
					<DayDialog
						day={currentDate}
						onResolve={() => {
							getDashboardStatsRequestState.refetch({force: true});
							getDashboardStreakStatsRequestState.refetch({force: true});
						}}
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
