import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {Day} from "./Day";
import {RequestErrorMessage} from "./ErrorMessages";
import {api} from "./services/api";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useMonthsWidget} from "./hooks/useMonthsWidget";

const habitDialogGrid: React.CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(7, 200px)",
	gridTemplateRows: "repeat(6, 120px)",
	gridGap: "3px",
};

export const Calendar: React.FC = () => {
	const [widget, date, monthOffset] = useMonthsWidget();

	const getMonthRequestState = Async.useAsync({
		promiseFn: api.calendar.getMonth,
		monthOffset,
		watch: monthOffset,
	});
	const {errorMessage} = getRequestStateErrors(getMonthRequestState);

	const days = widget.givenMonthDays.map(entry => ({
		...entry,
		...getMonthRequestState.data?.find(item => item.day === entry.day),
	}));

	return (
		<section className="flex flex-col items-center p-8 mx-auto">
			<div className="flex mb-16">
				<BareButton onClick={widget.setPreviousMonth} disabled={getMonthRequestState.isPending}>
					Previous
				</BareButton>
				<div className="mx-8 w-32">{date}</div>
				<BareButton onClick={widget.setNextMonth} disabled={getMonthRequestState.isPending}>
					Next
				</BareButton>
			</div>
			<Async.IfRejected state={getMonthRequestState}>
				<RequestErrorMessage>{errorMessage}</RequestErrorMessage>
			</Async.IfRejected>
			<ul style={habitDialogGrid}>
				{days.map(props => (
					<Day
						key={props.day.toString()}
						refreshCalendar={getMonthRequestState.reload}
						{...props}
					/>
				))}
			</ul>
		</section>
	);
};
