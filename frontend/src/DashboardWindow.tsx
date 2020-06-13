import {Link} from "react-router-dom";
import {useQuery} from "react-query";
import React from "react";
import deepEqual from "fast-deep-equal";
import VisuallyHidden from "@reach/visually-hidden";

import {ChevronUpIcon} from "./ui/icons/ChevronUp";
import {ChevronDownIcon} from "./ui/icons/ChevronDown";

import {DayDialog} from "./DayDialog";
import {DaySummaryChart} from "./DayDialogSummary";
import {ExpandContractList} from "./ui/ExpandContractList";
import {HabitItemDialog} from "./HabitItemDialog";
import {api} from "./services/api";
import {useQueryParams} from "./hooks/useQueryParam";
import {formatToday} from "./services/date-formatter";
import {pluralize} from "./services/pluralize";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {useErrorToast} from "./contexts/toasts-context";
import {DashboardStreakStats, DashboardHabitVoteStatsForDateRanges} from "./models";
import {UrlBuilder} from "./services/url-builder";
import {useToggle} from "./hooks/useToggle";
import * as UI from "./ui";

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

	const progressStreakStats = getDashboardStreakStatsRequestState.data?.progress_streaks ?? [];
	const regressStreakStats = getDashboardStreakStatsRequestState.data?.regress_streaks ?? [];
	const noStreakStats = getDashboardStreakStatsRequestState.data?.no_streak ?? [];

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
				</UI.ShowIf>

				<UI.ShowIf request={getDashboardStatsRequestState} is="loading">
					<UI.Text>Loading...</UI.Text>
				</UI.ShowIf>

				<UI.ShowIf request={getDashboardStatsRequestState} is="success">
					<RegressStreakList regressStreakStats={regressStreakStats} />
					<ProgressStreakList progressStreakStats={progressStreakStats} />
					<NoStreakList noStreakStats={noStreakStats} />
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

const ProgressStreakList: React.FC<{
	progressStreakStats: DashboardStreakStats["progress_streaks"];
}> = ({progressStreakStats}) => {
	const {on: isProgressStreakListVisible, toggle: toggleProgressStreakList} = useToggle(true);

	if (progressStreakStats.length === 0) return null;

	return (
		<>
			<UI.Row mt="48" mb="24" crossAxis="center">
				<UI.Header variant="extra-small">Progress streaks</UI.Header>
				<UI.Badge style={{padding: "0 3px"}} ml="6" variant="neutral">
					{progressStreakStats.length}
				</UI.Badge>

				{isProgressStreakListVisible && (
					<UI.Button
						ml="auto"
						variant="bare"
						title="Hide progress streak list"
						onClick={toggleProgressStreakList}
					>
						<VisuallyHidden>Hide progress streak list</VisuallyHidden>
						<ChevronUpIcon />
					</UI.Button>
				)}

				{!isProgressStreakListVisible && (
					<UI.Button
						ml="auto"
						variant="bare"
						title="Show progress streak list"
						onClick={toggleProgressStreakList}
					>
						<VisuallyHidden>Show progress streak list</VisuallyHidden>
						<ChevronDownIcon />
					</UI.Button>
				)}
			</UI.Row>

			{isProgressStreakListVisible && (
				<UI.Column bt="gray-1">
					<ExpandContractList max={5}>
						{progressStreakStats.map(habit => (
							<UI.Row py="12" by="gray-1" key={habit.id} mainAxis="end">
								<UI.Text mr="auto" as={Link} to={UrlBuilder.dashboard.habit.preview(habit.id)}>
									{habit.name}
								</UI.Text>

								{!habit.has_vote_for_today && (
									<UI.Badge
										as={Link}
										to={UrlBuilder.dashboard.calendar.habitToday(habit.id)}
										variant="neutral"
										mx="12"
										title="Vote for this habit"
									>
										No vote yet
									</UI.Badge>
								)}

								<UI.Badge variant="positive">
									{habit.progress_streak}
									{pluralize("day", habit.progress_streak)} progress streak
								</UI.Badge>
							</UI.Row>
						))}
					</ExpandContractList>
				</UI.Column>
			)}
		</>
	);
};

const RegressStreakList: React.FC<{
	regressStreakStats: DashboardStreakStats["regress_streaks"];
}> = ({regressStreakStats}) => {
	const {on: isRegressStreakListVisible, toggle: toggleRegressStreakList} = useToggle(true);

	if (regressStreakStats.length === 0) return null;

	return (
		<>
			<UI.Row mt="24" crossAxis="center">
				<UI.Header variant="extra-small">Regress streaks</UI.Header>
				<UI.Badge style={{padding: "0 3px"}} ml="6" variant="neutral">
					{regressStreakStats.length}
				</UI.Badge>

				{isRegressStreakListVisible && (
					<UI.Button
						ml="auto"
						variant="bare"
						title="Hide regress streak list"
						onClick={toggleRegressStreakList}
					>
						<VisuallyHidden>Hide regress streak list</VisuallyHidden>
						<ChevronUpIcon />
					</UI.Button>
				)}

				{!isRegressStreakListVisible && (
					<UI.Button
						ml="auto"
						variant="bare"
						title="Show regress streak list"
						onClick={toggleRegressStreakList}
					>
						<VisuallyHidden>Show regress streak list</VisuallyHidden>
						<ChevronDownIcon />
					</UI.Button>
				)}
			</UI.Row>

			{isRegressStreakListVisible && (
				<UI.Column by="gray-1" mt="24">
					<ExpandContractList max={5}>
						{regressStreakStats.map(habit => (
							<UI.Row py="12" by="gray-1" key={habit.id}>
								<UI.Text mr="auto" as={Link} to={UrlBuilder.dashboard.habit.preview(habit.id)}>
									{habit.name}
								</UI.Text>

								{!habit.has_vote_for_today && (
									<UI.Badge
										as={Link}
										to={UrlBuilder.dashboard.calendar.habitToday(habit.id)}
										variant="neutral"
										mx="12"
										title="Vote for this habit"
									>
										No vote yet
									</UI.Badge>
								)}

								<UI.Badge variant="negative">
									{habit.regress_streak}
									{pluralize("day", habit.regress_streak)} regress streak
								</UI.Badge>
							</UI.Row>
						))}
					</ExpandContractList>
				</UI.Column>
			)}
		</>
	);
};

const NoStreakList: React.FC<{
	noStreakStats: DashboardStreakStats["no_streak"];
}> = ({noStreakStats}) => {
	const {on: isNoStreakListVisible, toggle: toggleNoStreakList} = useToggle(true);

	if (noStreakStats.length === 0) return null;

	return (
		<>
			<UI.Row mt="24" crossAxis="center">
				<UI.Header variant="extra-small">No streak</UI.Header>
				<UI.Badge style={{padding: "0 3px"}} ml="6" variant="neutral">
					{noStreakStats.length}
				</UI.Badge>

				{isNoStreakListVisible && (
					<UI.Button
						ml="auto"
						variant="bare"
						title="Hide no streak list"
						onClick={toggleNoStreakList}
					>
						<VisuallyHidden>Hide no streak list</VisuallyHidden>
						<ChevronUpIcon />
					</UI.Button>
				)}

				{!isNoStreakListVisible && (
					<UI.Button
						ml="auto"
						variant="bare"
						title="Show no streak list"
						onClick={toggleNoStreakList}
					>
						<VisuallyHidden>Show no streak list</VisuallyHidden>
						<ChevronDownIcon />
					</UI.Button>
				)}
			</UI.Row>

			{isNoStreakListVisible && (
				<UI.Column by="gray-1" mt="24">
					<ExpandContractList max={5}>
						{noStreakStats.map(habit => (
							<UI.Row py="12" by="gray-1" key={habit.id}>
								<UI.Text mr="auto" as={Link} to={UrlBuilder.dashboard.habit.preview(habit.id)}>
									{habit.name}
								</UI.Text>

								{!habit.has_vote_for_today && (
									<UI.Badge
										as={Link}
										to={UrlBuilder.dashboard.calendar.habitToday(habit.id)}
										variant="neutral"
										mx="12"
										title="Vote for this habit"
									>
										No vote yet
									</UI.Badge>
								)}
							</UI.Row>
						))}
					</ExpandContractList>
				</UI.Column>
			)}
		</>
	);
};

type MotivationalTextProps = {
	total: DashboardHabitVoteStatsForDateRanges["today"]["maximumVotes"];
	votedFor: DashboardHabitVoteStatsForDateRanges["today"]["allVotes"];
	untracked: DashboardHabitVoteStatsForDateRanges["today"]["untrackedHabits"];
};

const MotivationalText: React.FC<MotivationalTextProps> = ({total, votedFor, untracked}) => {
	function selectStrategy() {
		if (total === 0) return "no_habits";
		if (votedFor === 0) return "no_votes_today";
		if (votedFor > 0 && votedFor < total) return "not_all_voted";
		if (votedFor === total) return "all_voted";
		return null;
	}

	const strategyToText = {
		no_habits: (
			// TODO: Improve it display a text and a button separately
			<UI.Text as={Link} variant="link" to="habits">
				Add your first tracked habit to start voting!
			</UI.Text>
		),
		no_votes_today: (
			<UI.Text>
				Start your day well! You have <UI.Text variant="bold">{total}</UI.Text>
				tracked habits to vote for. And {untracked} untracked habits.
			</UI.Text>
		),
		not_all_voted: (
			<UI.Column>
				<UI.Text>You're on a good track!</UI.Text>
				<UI.Text>
					You have <UI.Text variant="bold">{total - votedFor}</UI.Text>
					tracked habits to vote for left out of <UI.Text variant="bold">{total}</UI.Text> (and{" "}
					{untracked} untracked habits).
				</UI.Text>
			</UI.Column>
		),
		all_voted: (
			<UI.Column>
				<UI.Row>
					<UI.Text variant="bold">Congratulations!</UI.Text>
					<UI.Text ml="6">
						You voted for every one of <UI.Text variant="bold">{total}</UI.Text>
						tracked habits today!
					</UI.Text>
				</UI.Row>
				<UI.Text>You also have {untracked} untracked habits.</UI.Text>
			</UI.Column>
		),
	};

	const strategy = selectStrategy();

	if (!strategy) return null;
	return strategyToText[strategy];
};
