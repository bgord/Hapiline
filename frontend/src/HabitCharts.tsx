import {Link, LinkProps} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {ErrorMessage} from "./ErrorMessages";
import {Field, Select, Row, Label, Text} from "./ui";
import {IHabit} from "./interfaces/IHabit";
import {IVoteChartItem, voteToBgColor} from "./interfaces/IDayVote";
import {api} from "./services/api";
import {formatDay} from "./config/DATE_FORMATS";
import {useErrorNotification} from "./contexts/notifications-context";

type ChartRange = "last_week" | "last_month" | "all_time";

const chartRanges: {[key in ChartRange]: string} = {
	last_week: "last_week",
	last_month: "last_month",
	all_time: "all_time",
};

export const HabitCharts: React.FC<{id: IHabit["id"]}> = ({id}) => {
	const [dateRange, setChartRange] = React.useState<ChartRange>("last_week");
	const triggerErrorNotification = useErrorNotification();

	const habitVoteChartRequestState = Async.useAsync({
		promiseFn: api.habit.getHabitVoteChart,
		id,
		dateRange,
		watch: dateRange,
		onReject: () => triggerErrorNotification("Fetching chart data failed."),
	});

	const howManyHabitVoteChartItems = habitVoteChartRequestState?.data?.length;

	const regressVotes = habitVoteChartRequestState?.data?.filter(vote => vote.vote === "regress")
		.length;
	const plateauVotes = habitVoteChartRequestState?.data?.filter(vote => vote.vote === "plateau")
		.length;
	const progressVotes = habitVoteChartRequestState?.data?.filter(vote => vote.vote === "progress")
		.length;

	return (
		<>
			<Field mt="48" variant="row" style={{alignItems: "center", justifyContent: "flex-end"}}>
				<Label mr="12" htmlFor="date_range">
					Select date range:
				</Label>
				<Select
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
				</Select>
			</Field>
			<Async.IfFulfilled state={habitVoteChartRequestState}>
				<Row mt="24">
					{habitVoteChartRequestState.data?.map(item => (
						<ChartCell
							key={item.day}
							habitId={id}
							style={{flexBasis: `calc(100% / ${howManyHabitVoteChartItems})`}}
							{...item}
						/>
					))}
				</Row>
				<Row mt="6" crossAxis="center">
					<Text style={{fontSize: "72px", color: "#ef8790"}}>·</Text>
					<Text>{regressVotes} regress votes</Text>

					<Text ml="24" style={{fontSize: "72px", color: "var(--gray-3)"}}>
						·
					</Text>
					<Text>{plateauVotes} plateau votes</Text>

					<Text ml="24" style={{fontSize: "72px", color: "#8bdb90"}}>
						·
					</Text>
					<Text>{progressVotes} progress votes</Text>

					<Text ml="auto" variant="bold">
						{howManyHabitVoteChartItems}
					</Text>
					<Text ml="6">in total</Text>
				</Row>
			</Async.IfFulfilled>
			<Async.IfRejected state={habitVoteChartRequestState}>
				<ErrorMessage className="mt-8">Charts unavailable, please try again.</ErrorMessage>
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
	const backgroundColor = voteToBgColor.get(vote ?? "plateau");

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
