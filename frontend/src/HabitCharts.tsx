import React from "react";

import {IHabit} from "./interfaces/IHabit";

type ChartRange = "last_week" | "last_month" | "all_time";

const chartRanges: {[key in ChartRange]: string} = {
	last_week: "last_week",
	last_month: "last_month",
	all_time: "all_time",
};

export const HabitCharts: React.FC<{id: IHabit["id"]}> = ({id}) => {
	const [chartRange, setChartRange] = React.useState<ChartRange>("last_week");
	console.log(id);

	return (
		<div className="mt-6" style={{gridColumn: "span 4", gridRow: 4}}>
			<label>Select date range:</label>
			<select
				className="field ml-2"
				value={chartRange}
				onChange={event => {
					const {value} = event.target;
					if (isChartRange(value) && value !== chartRange) {
						setChartRange(value);
					}
				}}
			>
				<option value="last_week">Last week</option>
				<option value="last_month">Last month</option>
				<option value="all_time">All time</option>
			</select>
		</div>
	);
};

function isChartRange(value: string): value is ChartRange {
	return Object.keys(chartRanges).includes(value);
}
