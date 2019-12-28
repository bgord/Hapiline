import {
	eachDayOfInterval,
	endOfMonth,
	format,
	startOfMonth,
	subMonths,
} from "date-fns";
import React from "react";

export const Calendar: React.FC = () => {
	const [monthOffset, setMonthOffset] = React.useState(0);

	const setPreviousMonth = () => setMonthOffset(x => x - 1);
	const setNextMonth = () => setMonthOffset(x => x + 1);

	const today = Date.now();

	const date = subMonths(today, monthOffset);

	const startOfCurrentMonth = startOfMonth(date);
	const endOfCurrentMonth = endOfMonth(date);

	// 0 - Sunday, 1 - Monday, ... , 6 - Saturday
	const startOfCurrentMonthDay = startOfCurrentMonth.getDay();

	const offset = startOfCurrentMonthDay === 0 ? 7 : startOfCurrentMonthDay;

	const currentMonthDays = eachDayOfInterval({
		start: startOfCurrentMonth,
		end: endOfCurrentMonth,
	});

	const habitDialogGrid: React.CSSProperties = {
		display: "grid",
		gridTemplateColumns: "repeat(7, 100px)",
		gridTemplateRows: "repeat(6, 100px)",
	};

	return (
		<>
			<div className="flex">
				<button type="button" onClick={setNextMonth}>
					Previous
				</button>
				<div className="mx-8">{format(date, "MMMM yyyy")}</div>
				<button type="button" onClick={setPreviousMonth}>
					Next
				</button>
			</div>
			<ul style={habitDialogGrid}>
				{currentMonthDays.map((day, index) => (
					<li
						key={day.toString()}
						style={{gridColumnStart: index === 0 ? offset : undefined}}
					>
						{format(day, "yyyy-MM-dd")}
					</li>
				))}
			</ul>
		</>
	);
};
