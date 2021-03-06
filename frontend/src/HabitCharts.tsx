import {Link, LinkProps} from "react-router-dom";
import {useQuery, QueryResult} from "react-query";
import React from "react";
import {pluralize} from "./services/pluralize";
import {UrlBuilder} from "./services/url-builder";

import * as UI from "./ui";
import {
	Habit,
	DayVote,
	voteToBgColor,
	HabitVoteChartDateRangeType,
	HabitVoteChartDateRanges,
	HabitVoteType,
} from "./models";
import {api} from "./services/api";
import {formatDay, formatShortDay} from "./services/date-formatter";
import {useErrorToast} from "./contexts/toasts-context";
import {useMediaQuery, MEDIA_QUERY} from "./ui/breakpoints";

export function HabitCharts({id, children}: UI.WithChildren<{id: Habit["id"]}>) {
	const [dateRange, setChartRange] = React.useState<HabitVoteChartDateRangeType>("last_week");
	const triggerErrorToast = useErrorToast();

	const mediaQuery = useMediaQuery();

	const habitVoteChartRequestState = useQuery<
		DayVote[],
		["habit_chart", Habit["id"], HabitVoteChartDateRangeType]
	>({
		queryKey: ["habit_chart", id, dateRange],
		queryFn: api.habit.getHabitVoteChart,
		config: {
			onError: () => triggerErrorToast("Fetching chart data failed."),
			retry: false,
		},
	});

	const numberOfRegressVotes = getNumberOfVotesByType(habitVoteChartRequestState, "regress");
	const numberOfPlateauVotes = getNumberOfVotesByType(habitVoteChartRequestState, "plateau");
	const numberOfProgressVotes = getNumberOfVotesByType(habitVoteChartRequestState, "progress");

	const numberOfHabitVoteChartItems = habitVoteChartRequestState.data?.length ?? 0;
	const getPercentageOfVotes = getPercentageFactory(numberOfHabitVoteChartItems);

	const regressVotesPrct = getPercentageOfVotes(numberOfRegressVotes);
	const plateauVotesPrct = getPercentageOfVotes(numberOfPlateauVotes);
	const progressVotesPrct = getPercentageOfVotes(numberOfProgressVotes);

	const shouldDisplayChartLabels: boolean =
		dateRange === "last_week" || (habitVoteChartRequestState?.data?.length ?? 0) <= 7;

	return (
		<>
			<UI.Row mainAxis="between" wrap={[, "wrap"]}>
				<UI.Field variant="row" style={{alignItems: "center", justifyContent: "flex-end"}}>
					<UI.Label mr="12" htmlFor="date_range">
						Select date range:
					</UI.Label>
					<UI.Select
						id="date_range"
						value={dateRange}
						onChange={event => {
							const {value} = event.target;
							if (isChartRange(value) && value !== dateRange) {
								setChartRange(value);
							}
						}}
					>
						<option value="last_week">Last week</option>
						<option value="last_month">Last month</option>
						<option value="all_time">All time</option>
					</UI.Select>
				</UI.Field>
				{children}
			</UI.Row>

			<UI.ShowIf request={habitVoteChartRequestState} is="success">
				<UI.Row mt="24">
					{habitVoteChartRequestState.data?.map(item => (
						<UI.Column width="100%" key={item.day.toString()}>
							{shouldDisplayChartLabels && (
								<UI.Text variant="info" style={{textAlign: "center"}}>
									{formatShortDay(item.day)}
								</UI.Text>
							)}

							<ChartCell
								key={String(item.day)}
								habitId={id}
								style={{flexBasis: `calc(100% / ${numberOfHabitVoteChartItems})`}}
								{...item}
							/>
						</UI.Column>
					))}
				</UI.Row>

				{mediaQuery === MEDIA_QUERY.default && (
					<UI.Row mt="6" crossAxis="center">
						<UI.SmallCircle fill="var(--red-neutral)" />
						<UI.Text ml="6" mr="24">
							{numberOfRegressVotes} regress {pluralize("vote", numberOfRegressVotes)} (
							{regressVotesPrct}%)
						</UI.Text>

						<UI.SmallCircle fill="var(--gray-3)" />
						<UI.Text ml="6" mr="24">
							{numberOfPlateauVotes} plateau {pluralize("vote", numberOfPlateauVotes)} (
							{plateauVotesPrct}%)
						</UI.Text>

						<UI.SmallCircle fill="var(--green-neutral)" />
						<UI.Text ml="6" mr="24">
							{numberOfProgressVotes} progress {pluralize("vote", numberOfProgressVotes)} (
							{progressVotesPrct}%)
						</UI.Text>

						<UI.Text ml="auto" variant="bold">
							{numberOfHabitVoteChartItems}
						</UI.Text>
						<UI.Text wrap="no" ml="6">
							in total
						</UI.Text>
					</UI.Row>
				)}
			</UI.ShowIf>

			<UI.ShowIf request={habitVoteChartRequestState} is="error">
				<UI.Error mt="24">Charts unavailable, please try again.</UI.Error>
			</UI.ShowIf>
		</>
	);
}

function ChartCell({day, vote, habitId}: DayVote & Partial<LinkProps> & {habitId: Habit["id"]}) {
	const title = `${formatDay(day)} - ${vote ?? "no vote"}`;

	return (
		<Link
			to={UrlBuilder.calendar.day.habit({day, habitId})}
			title={title}
			key={String(day)}
			data-bw="1"
			data-br="gray-1"
			style={{
				backgroundColor: voteToBgColor.get(vote),
				height: "24px",
			}}
		/>
	);
}

function isChartRange(value: string): value is HabitVoteChartDateRangeType {
	return Object.keys(HabitVoteChartDateRanges).includes(value);
}

function getNumberOfVotesByType(request: QueryResult<DayVote[]>, type: HabitVoteType) {
	return request.data?.filter(({vote}) => vote === type).length ?? 0;
}

function getPercentageFactory(maximum: number) {
	return (value: number) => ((value / maximum) * 100).toFixed(2);
}
