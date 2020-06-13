import {Link, LinkProps} from "react-router-dom";
import {useQuery} from "react-query";
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
} from "./models";
import {api} from "./services/api";
import {formatDay} from "./services/date-formatter";
import {useErrorToast} from "./contexts/toasts-context";

export const HabitCharts: React.FC<{id: Habit["id"]}> = ({id, children}) => {
	const [dateRange, setChartRange] = React.useState<HabitVoteChartDateRangeType>("last_week");
	const triggerErrorToast = useErrorToast();

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

	const numberOfHabitVoteChartItems = habitVoteChartRequestState?.data?.length ?? 0;

	const numberOfRegressVotes =
		habitVoteChartRequestState?.data?.filter(vote => vote.vote === "regress").length ?? 0;
	const numberOfPlateauVotes =
		habitVoteChartRequestState?.data?.filter(vote => vote.vote === "plateau").length ?? 0;
	const numberOfProgressVotes =
		habitVoteChartRequestState?.data?.filter(vote => vote.vote === "progress").length ?? 0;

	const regressVotesPrct = ((numberOfRegressVotes / numberOfHabitVoteChartItems) * 100).toFixed(2);
	const plateauVotesPrct = ((numberOfPlateauVotes / numberOfHabitVoteChartItems) * 100).toFixed(2);
	const progressVotesPrct = ((numberOfProgressVotes / numberOfHabitVoteChartItems) * 100).toFixed(
		2,
	);

	return (
		<>
			<UI.Row mainAxis="between">
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
							style={{
								flexBasis: `calc(100% / ${numberOfHabitVoteChartItems})`,
							}}
							{...item}
						/>
					))}
				</UI.Row>
				<UI.Row mt="6" crossAxis="center">
					<UI.Text style={{fontSize: "72px", color: "#ef8790"}}>·</UI.Text>
					<UI.Text>
						{numberOfRegressVotes} regress {pluralize("vote", numberOfRegressVotes)}(
						{regressVotesPrct}%)
					</UI.Text>
					<UI.Text ml="24" style={{fontSize: "72px", color: "var(--gray-3)"}}>
						·
					</UI.Text>
					<UI.Text>
						{numberOfPlateauVotes} plateau {pluralize("vote", numberOfPlateauVotes)}(
						{plateauVotesPrct}%)
					</UI.Text>
					<UI.Text ml="24" style={{fontSize: "72px", color: "#8bdb90"}}>
						·
					</UI.Text>
					<UI.Text>
						{numberOfProgressVotes} progress {pluralize("vote", numberOfProgressVotes)}(
						{progressVotesPrct}%)
					</UI.Text>

					<UI.Text ml="auto" variant="bold">
						{numberOfHabitVoteChartItems}
					</UI.Text>
					<UI.Text ml="6">in total</UI.Text>
				</UI.Row>
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
