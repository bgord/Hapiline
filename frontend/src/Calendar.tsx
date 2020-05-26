import * as Async from "react-async";
import React from "react";

import * as UI from "./ui";
import {CalendarIcon} from "./ui/icons/Calendar";
import {Day} from "./Day";
import {api} from "./services/api";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {useMonthsWidget} from "./hooks/useMonthsWidget";
import {useTrackedHabits} from "./contexts/habits-context";
import {DayCellWithFullStats} from "./interfaces/index";

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

	const dayStatsFromServer = getMonthRequestState.data;

	const dayCellsWithStats: DayCellWithFullStats[] = widget.daysOfTheMonth.map(dayCell => {
		const day = new Date(dayCell.day);

		const statsForTheDay = dayStatsFromServer?.find(item => item.day === dayCell.day);

		const createdHabitsCount = statsForTheDay?.createdHabitsCount || 0;
		const progressVotesCountStats = statsForTheDay?.progressVotesCountStats || 0;
		const plateauVotesCountStats = statsForTheDay?.plateauVotesCountStats || 0;
		const regressVotesCountStats = statsForTheDay?.regressVotesCountStats || 0;
		const nullVotesCountStats = statsForTheDay?.nullVotesCountStats || 0;

		const habitsAvailableAtThisDayCount = getHabitsAvailableAtThisDay(trackedHabits, day).length;

		const noVotesCountStats =
			habitsAvailableAtThisDayCount -
			progressVotesCountStats -
			plateauVotesCountStats -
			regressVotesCountStats;

		return {
			day: dayCell.day,
			styles: dayCell.styles,
			createdHabitsCount,
			progressVotesCountStats,
			plateauVotesCountStats,
			regressVotesCountStats,
			nullVotesCountStats,
			noVotesCountStats,
		};
	});

	return (
		<UI.Column mt="24" crossAxis="center">
			<UI.Row mb="24" bg="gray-2" px="72" py="12" width="auto">
				<UI.Button
					variant="outlined"
					onClick={widget.setPreviousMonth}
					disabled={getMonthRequestState.isPending}
					style={{width: "100px"}}
					mr="24"
				>
					Previous
				</UI.Button>
				<CalendarIcon />
				<UI.Text ml="6" variant="bold">
					{date}
				</UI.Text>
				<UI.Button
					ml="24"
					variant="outlined"
					onClick={widget.setNextMonth}
					disabled={getMonthRequestState.isPending}
					style={{width: "100px"}}
				>
					Next
				</UI.Button>
			</UI.Row>

			<Async.IfRejected state={getMonthRequestState}>
				<UI.ErrorBanner my="24">{errorMessage}</UI.ErrorBanner>
			</Async.IfRejected>

			<UI.Card bg="gray-0" data-testid="calendar" style={habitDialogGrid} p="12">
				{dayCellsWithStats.map(props => (
					<Day
						key={props.day.toString()}
						refreshCalendar={getMonthRequestState.reload}
						{...props}
					/>
				))}
			</UI.Card>
		</UI.Column>
	);
};
