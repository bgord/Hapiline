import * as Async from "react-async";
import React from "react";

import {RequestErrorMessage} from "./ErrorMessages";
import {api} from "./services/api";
import {useMonthsWidget} from "./hooks/useMonthsWidget";
import {useRequestErrors} from "./hooks/useRequestErrors";
import {Day} from "./Day";

export const Calendar: React.FC = () => {
	const [widget, date, monthOffset] = useMonthsWidget();

	const getMonthRequestState = Async.useAsync({
		promiseFn: api.calendar.getMonth,
		monthOffset,
		watch: monthOffset,
	});

	const {errorMessage} = useRequestErrors(getMonthRequestState);

	const days = widget.givenMonthDays.map(entry => ({
		...entry,
		...getMonthRequestState.data?.find(item => item.day === entry.day),
	}));

	const habitDialogGrid: React.CSSProperties = {
		display: "grid",
		gridTemplateColumns: "repeat(7, 200px)",
		gridTemplateRows: "repeat(6, 120px)",
		gridGap: "3px",
	};

	return (
		<section className="flex flex-col items-center p-8 mx-auto">
			<div className="flex mb-16">
				<button
					className="px-2 uppercase"
					type="button"
					onClick={widget.setPreviousMonth}
					disabled={getMonthRequestState.isPending}
				>
					Previous
				</button>
				<div className="mx-8 w-32">{date}</div>
				<button
					className="px-2 uppercase"
					type="button"
					onClick={widget.setNextMonth}
					disabled={getMonthRequestState.isPending}
				>
					Next
				</button>
			</div>
			<Async.IfRejected state={getMonthRequestState}>
				<RequestErrorMessage>{errorMessage}</RequestErrorMessage>
			</Async.IfRejected>
			<ul style={habitDialogGrid}>
				{days.map(props => (
					<Day key={props.day.toString()} {...props} />
				))}
			</ul>
		</section>
	);
};
