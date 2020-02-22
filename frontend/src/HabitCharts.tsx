import {Link, LinkProps} from "react-router-dom";
import * as Async from "react-async";
import React from "react";

import {ErrorMessage} from "./ErrorMessages";
import {Field} from "./ui/field/Field";
import {IHabit} from "./interfaces/IHabit";
import {IVoteChartItem, Vote} from "./interfaces/IDayVote";
import {Label} from "./ui/label/Label";
import {Row} from "./ui/row/Row";
import {Select} from "./ui/select/Select";
import {api} from "./services/api";
import {formatDay} from "./config/DATE_FORMATS";
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
			<Field
				variant="row"
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "flex-end",
					marginTop: "36px",
				}}
			>
				<Label htmlFor="date_range">Select date range:</Label>
				<Select
					style={{marginLeft: "6px"}}
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
				<Row style={{marginTop: "24px"}}>
					{habitVoteChartRequestState.data?.map(item => (
						<ChartCell
							key={item.day}
							habitId={id}
							style={{flexBasis: `calc(100% / ${howManyHabitVoteChartItems})`}}
							{...item}
						/>
					))}
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
	const bgColor = voteToBgColor[vote ?? "plateau"];
	const title = `${date} - ${vote ?? "no vote"}`;
	return (
		<Link
			to={`/calendar?preview_day=${date}&highlighted_habit_id=${habitId}`}
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
