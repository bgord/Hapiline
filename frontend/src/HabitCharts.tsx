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
import {formatDay} from "./services/date-formatter";
import {useErrorToast} from "./contexts/toasts-context";
import {useMediaQuery, MEDIA_QUERY} from "./ui/breakpoints";

export const HabitCharts: React.FC<{id: Habit["id"]}> = ({id, children}) => {
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

	const numberOfRegressVotes = getByVoteType(habitVoteChartRequestState, "regress");
	const numberOfPlateauVotes = getByVoteType(habitVoteChartRequestState, "plateau");
	const numberOfProgressVotes = getByVoteType(habitVoteChartRequestState, "progress");

	const numberOfHabitVoteChartItems = habitVoteChartRequestState.data?.length ?? 0;
	const getPercentageOfVotes = getPercentageOfFactory(numberOfHabitVoteChartItems);

	const regressVotesPrct = getPercentageOfVotes(numberOfRegressVotes);
	const plateauVotesPrct = getPercentageOfVotes(numberOfPlateauVotes);
	const progressVotesPrct = getPercentageOfVotes(numberOfProgressVotes);

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
						<ChartCell
							key={String(item.day)}
							habitId={id}
							style={{flexBasis: `calc(100% / ${numberOfHabitVoteChartItems})`}}
							{...item}
						/>
					))}
				</UI.Row>

				{mediaQuery === MEDIA_QUERY.default && (
					<UI.Row mt="6" crossAxis="center">
						<UI.Text style={{fontSize: "72px", color: "#ef8790"}}>·</UI.Text>
						<UI.Text>
							{numberOfRegressVotes} regress {pluralize("vote", numberOfRegressVotes)} (
							{regressVotesPrct}%)
						</UI.Text>
						<UI.Text ml="24" style={{fontSize: "72px", color: "var(--gray-3)"}}>
							·
						</UI.Text>
						<UI.Text>
							{numberOfPlateauVotes} plateau {pluralize("vote", numberOfPlateauVotes)} (
							{plateauVotesPrct}%)
						</UI.Text>
						<UI.Text ml="24" style={{fontSize: "72px", color: "#8bdb90"}}>
							·
						</UI.Text>
						<UI.Text>
							{numberOfProgressVotes} progress {pluralize("vote", numberOfProgressVotes)} (
							{progressVotesPrct}%)
						</UI.Text>

						<UI.Text ml="auto" variant="bold">
							{numberOfHabitVoteChartItems}
						</UI.Text>
						<UI.Text style={{whiteSpace: "nowrap"}} ml="6">
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
};

const ChartCell: React.FC<DayVote & Partial<LinkProps> & {habitId: Habit["id"]}> = ({
	day,
	vote,
	habitId,
	...rest
}) => {
	const date = formatDay(day);
	const backgroundColor = voteToBgColor.get(vote);

	const title = `${date} - ${vote ?? "no vote"}`;

	return (
		<Link
			to={UrlBuilder.calendar.day.habit({
				day,
				habitId,
			})}
			data-bw="1"
			data-b="gray-1"
			title={title}
			key={String(day)}
			style={{
				backgroundColor,
				height: "24px",
				...rest.style,
			}}
		/>
	);
};

function isChartRange(value: string): value is HabitVoteChartDateRangeType {
	return Object.keys(HabitVoteChartDateRanges).includes(value);
}

function getByVoteType(request: QueryResult<DayVote[]>, type: HabitVoteType) {
	return request.data?.filter(({vote}) => vote === type).length ?? 0;
}

function getPercentageOfFactory(maximum: number) {
	return (value: number) => ((value / maximum) * 100).toFixed(2);
}
