import React from "react";

import {useMonthsWidget} from "./hooks/useMonthsWidget";

export const Calendar: React.FC = () => {
	const [widget, date] = useMonthsWidget();

	const habitDialogGrid: React.CSSProperties = {
		display: "grid",
		gridTemplateColumns: "repeat(7, 100px)",
		gridTemplateRows: "repeat(6, 100px)",
	};

	return (
		<section className="flex flex-col items-center p-8 mx-auto">
			<div className="flex mb-24">
				<button
					className="px-2"
					type="button"
					onClick={widget.setPreviousMonth}
				>
					Previous
				</button>
				<div className="mx-8 w-32">{date}</div>
				<button className="px-2" type="button" onClick={widget.setNextMonth}>
					Next
				</button>
			</div>
			<ul style={habitDialogGrid}>
				{widget.givenMonthDays.map(({day, styles}) => (
					<li className="bg-blue-100" key={day.toString()} style={styles}>
						{day}
					</li>
				))}
			</ul>
		</section>
	);
};
