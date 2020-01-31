import * as Async from "react-async";
import React from "react";

import {BareButton} from "./BareButton";
import {Day} from "./Day";
import {FullDayWithVoteStats, FullDayWithVoteStatsFromAPI} from "./interfaces/IMonthDay";
import {RequestErrorMessage} from "./ErrorMessages";
import {api} from "./services/api";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useTrackedHabits} from "./contexts/habits-context";
import {useMonthsWidget} from "./hooks/useMonthsWidget";

const habitDialogGrid: React.CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(7, 200px)",
	gridTemplateRows: "repeat(6, 120px)",
	gridGap: "10px",
};

export const Calendar: React.FC = () => {
	const [widget, date, monthOffset] = useMonthsWidget();
	const trackedHabits = useTrackedHabits();

	const getMonthRequestState = Async.useAsync({
		promiseFn: api.calendar.getMonth,
		monthOffset,
		watch: monthOffset,
	});
	const {errorMessage} = getRequestStateErrors(getMonthRequestState);

	const days: FullDayWithVoteStats[] = widget.givenMonthDays.map(entry => {
		const givenDay = new Date(entry.day);

		const fullDayWithVoteStatsFromAPI: FullDayWithVoteStatsFromAPI = {
			...entry,
			...getMonthRequestState.data?.find(item => item.day === entry.day),
		};

		const habitsAvailableAtThisDayCount = getHabitsAvailableAtThisDay(trackedHabits, givenDay)
			.length;
		const noVotesCountStats = getNoVotesCountStats(
			habitsAvailableAtThisDayCount,
			fullDayWithVoteStatsFromAPI,
		);

		return {
			...fullDayWithVoteStatsFromAPI,
			noVotesCountStats,
		};
	});

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

function getNoVotesCountStats(
	habitsAvailableAtGivenDayCount: number,
	stats: Omit<FullDayWithVoteStatsFromAPI, "day" | "styles">,
): number {
	return (
		habitsAvailableAtGivenDayCount -
		(stats.progressVotesCountStats ?? 0) -
		(stats.plateauVotesCountStats ?? 0) -
		(stats.regressVotesCountStats ?? 0)
	);
}
