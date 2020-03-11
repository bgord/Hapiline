import * as Async from "react-async";
import React from "react";

import {Button, Row, Column, Text, Card} from "./ui";
import {CalendarIcon} from "./ui/icons/Calendar";
import {Day} from "./Day";
import {FullDayWithVoteStats, FullDayWithVoteStatsFromAPI} from "./interfaces/IMonthDay";
import {RequestErrorMessage} from "./ErrorMessages";
import {api} from "./services/api";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {useMonthsWidget} from "./hooks/useMonthsWidget";
import {useTrackedHabits} from "./contexts/habits-context";

const habitDialogGrid: React.CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(7, 200px)",
	gridTemplateRows: "repeat(6, 100px)",
	gridGap: "12px",
};

export const Calendar: React.FC = () => {
	useDocumentTitle("Hapiline - calendar");

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
		<Column mt="24" crossAxis="center">
			<Row mb="24" px="72" py="12" style={{background: "var(--gray-2)"}} width="auto">
				<Button
					variant="outlined"
					onClick={widget.setPreviousMonth}
					disabled={getMonthRequestState.isPending}
					style={{width: "100px"}}
					mr="24"
				>
					Previous
				</Button>
				<CalendarIcon />
				<Text ml="6" variant="bold">
					{date}
				</Text>
				<Button
					ml="24"
					variant="outlined"
					onClick={widget.setNextMonth}
					disabled={getMonthRequestState.isPending}
					style={{width: "100px"}}
				>
					Next
				</Button>
			</Row>
			<Async.IfRejected state={getMonthRequestState}>
				<RequestErrorMessage>{errorMessage}</RequestErrorMessage>
			</Async.IfRejected>
			<Card style={{...habitDialogGrid, background: "white"}} data-p="12">
				{days.map(props => (
					<Day
						key={props.day.toString()}
						refreshCalendar={getMonthRequestState.reload}
						{...props}
					/>
				))}
			</Card>
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
