import {Link, LinkProps} from "react-router-dom";
import * as Async from "react-async";
import React from "react";
import {pluralize} from "./services/pluralize";

import * as UI from "./ui";
import {IHabit} from "./interfaces/IHabit";
import {IVoteChartItem, voteToBgColor} from "./interfaces/IDayVote";
import {api} from "./services/api";
import {formatDay} from "./config/DATE_FORMATS";
import {useErrorToast} from "./contexts/toasts-context";

type ChartRange = "last_week" | "last_month" | "all_time";

const chartRanges: {[key in ChartRange]: string} = {
	last_week: "last_week",
	last_month: "last_month",
	all_time: "all_time",
};

export const HabitCharts: React.FC<{id: IHabit["id"]}> = ({id, children}) => {
	const [dateRange, setChartRange] = React.useState<ChartRange>("last_week");
	const triggerErrorNotification = useErrorToast();

	const habitVoteChartRequestState = Async.useAsync({
		promiseFn: api.habit.getHabitVoteChart,
		id,
		dateRange,
		watch: dateRange,
		onReject: () => triggerErrorNotification("Fetching chart data failed."),
	});

	const howManyHabitVoteChartItems = habitVoteChartRequestState?.data?.length ?? 0;

	const regressVotes =
		habitVoteChartRequestState?.data?.filter(vote => vote.vote === "regress").length ?? 0;
	const plateauVotes =
		habitVoteChartRequestState?.data?.filter(vote => vote.vote === "plateau").length ?? 0;
	const progressVotes =
		habitVoteChartRequestState?.data?.filter(vote => vote.vote === "progress").length ?? 0;

	const regressVotesPrct = ((regressVotes / howManyHabitVoteChartItems) * 100).toFixed(2);
	const plateauVotesPrct = ((plateauVotes / howManyHabitVoteChartItems) * 100).toFixed(2);
	const progressVotesPrct = ((progressVotes / howManyHabitVoteChartItems) * 100).toFixed(2);

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
			<Async.IfFulfilled state={habitVoteChartRequestState}>
				<UI.Row mt="24">
					{habitVoteChartRequestState.data?.map(item => (
						<ChartCell
							key={item.day}
							habitId={id}
							style={{flexBasis: `calc(100% / ${howManyHabitVoteChartItems})`}}
							{...item}
						/>
					))}
				</UI.Row>
				<UI.Row mt="6" crossAxis="center">
					<UI.Text style={{fontSize: "72px", color: "#ef8790"}}>·</UI.Text>
					<UI.Text>
						{regressVotes} regress {pluralize("vote", regressVotes)} ({regressVotesPrct}%)
					</UI.Text>
					<UI.Text ml="24" style={{fontSize: "72px", color: "var(--gray-3)"}}>
						·
					</UI.Text>
					<UI.Text>
						{plateauVotes} plateau {pluralize("vote", plateauVotes)} ({plateauVotesPrct}%)
					</UI.Text>
					<UI.Text ml="24" style={{fontSize: "72px", color: "#8bdb90"}}>
						·
					</UI.Text>
					<UI.Text>
						{progressVotes} progress {pluralize("vote", progressVotes)} ({progressVotesPrct}%)
					</UI.Text>

					<UI.Text ml="auto" variant="bold">
						{howManyHabitVoteChartItems}
					</UI.Text>
					<UI.Text ml="6">in total</UI.Text>
				</UI.Row>
			</Async.IfFulfilled>
			<Async.IfRejected state={habitVoteChartRequestState}>
				<UI.Error mt="24">Charts unavailable, please try again.</UI.Error>
			</Async.IfRejected>
		</>
	);
};

const ChartCell: React.FC<IVoteChartItem & Partial<LinkProps> & {habitId: IHabit["id"]}> = ({
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
			to={`/calendar?preview_day=${date}&highlighted_habit_id=${habitId}`}
			title={title}
			key={day}
			style={{
				backgroundColor,
				height: "24px",
				...rest.style,
			}}
		/>
	);
};

function isChartRange(value: string): value is ChartRange {
	return Object.keys(chartRanges).includes(value);
}
