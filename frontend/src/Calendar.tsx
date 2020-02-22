import * as Async from "react-async";
import React from "react";

import {Button} from "./ui/button/Button";
import {Column} from "./ui/column/Column";
import {Day} from "./Day";
import {FullDayWithVoteStats, FullDayWithVoteStatsFromAPI} from "./interfaces/IMonthDay";
import {Header} from "./ui/header/Header";
import {RequestErrorMessage} from "./ErrorMessages";
import {Row} from "./ui/row/Row";
import {api} from "./services/api";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useMonthsWidget} from "./hooks/useMonthsWidget";
import {useTrackedHabits} from "./contexts/habits-context";

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
		<Column style={{margin: "0 auto", alignItems: "center", marginTop: "36px"}}>
			<Row mb="72" style={{width: "auto"}}>
				<Button
					variant="secondary"
					onClick={widget.setPreviousMonth}
					disabled={getMonthRequestState.isPending}
				>
					Previous
				</Button>
				<Header ml="48" mr="48" variant="small">
					{date}
				</Header>
				<Button
					variant="secondary"
					onClick={widget.setNextMonth}
					disabled={getMonthRequestState.isPending}
				>
					Next
				</Button>
			</Row>
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
		</Column>
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
