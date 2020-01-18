import {Link, LinkProps} from "react-router-dom";
import {format} from "date-fns";
import * as Async from "react-async";
import React from "react";

import {DATE_FORMATS} from "./config/DATE_FORMATS";
import {ErrorMessage} from "./ErrorMessages";
import {IHabit} from "./interfaces/IHabit";
import {IVoteChartItem, Vote} from "./interfaces/IDayVote";
import {api} from "./services/api";
import {useErrorNotification} from "./contexts/notifications-context";

type ChartRange = "last_week" | "last_month" | "all_time";

const chartRanges: {[key in ChartRange]: string} = {
	last_week: "last_week",
	last_month: "last_month",
	all_time: "all_time",
};

const voteToBgColor: {[key in NonNullable<Vote>]: string} = {
	progress: "bg-green-300",
	plateau: "bg-gray-300",
	regress: "bg-red-300",
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

	return (
		<>
			<div
				className="mt-6 flex items-center"
				style={{gridColumn: "span 4", gridRow: 4, alignSelf: "start"}}
			>
				<label htmlFor="date_range">Select date range:</label>
				<select
					id="date_range"
					className="field mx-2"
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
				</select>
			</div>
			<Async.IfFulfilled state={habitVoteChartRequestState}>
				<div
					className="flex w-full mt-8 border-l-2 border-gray-500"
					style={{gridColumn: "span 4", gridRow: 5, alignSelf: "start"}}
				>
					{habitVoteChartRequestState.data?.map(item => (
						<ChartCell
							key={item.day}
							habitId={id}
							style={{flexBasis: `calc(100% / ${howManyHabitVoteChartItems})`}}
							{...item}
						/>
					))}
				</div>
			</Async.IfFulfilled>
			<Async.IfRejected state={habitVoteChartRequestState}>
				<ErrorMessage
					className="mt-8"
					style={{gridColumn: "span 4", gridRow: 5, alignSelf: "start"}}
				>
					Charts unavailable, please try again.
				</ErrorMessage>
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
	const date = format(new Date(day), DATE_FORMATS.day);
	const bgColor = voteToBgColor[vote ?? "plateau"];
	const title = `${date} - ${vote ?? "no vote"}`;
	return (
		<Link
			to={`/calendar?previewDay=${date}&highlightedHabitId=${habitId}`}
			title={title}
			key={day}
			className={`h-8 border-r-2 border-gray-500 ${bgColor}`}
			{...rest}
		/>
	);
};

function isChartRange(value: string): value is ChartRange {
	return Object.keys(chartRanges).includes(value);
}
