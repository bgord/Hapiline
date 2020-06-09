import {useQuery} from "react-query";
import React from "react";
import {isSameMonth, subMonths} from "date-fns";

import * as UI from "./ui";
import {CalendarIcon} from "./ui/icons/Calendar";
import {Day} from "./Day";
import {api} from "./services/api";
import {getHabitsAvailableAtThisDay} from "./selectors/getHabitsAvailableAtDay";
import {getRequestStateErrors} from "./selectors/getRequestErrors";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {useMonthsWidget, MonthOffset} from "./hooks/useMonthsWidget";
import {useTrackedHabits} from "./contexts/habits-context";
import {DayCellWithFullStats, DayStatsFromServer} from "./interfaces/index";

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

	const getMonthRequestState = useQuery<DayStatsFromServer[], ["month", MonthOffset]>({
		queryKey: ["month", monthOffset],
		queryFn: api.calendar.getMonth,
		config: {
			staleTime: 60 * 1000, // 1 minute
			retry: false,
		},
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

	const isCurrentMonth = monthOffset === 0;
	const isNextButtonDisabled = getMonthRequestState.status === "loading" || isCurrentMonth;

	function getNextButtonTitle() {
		if (getMonthRequestState.status === "loading") return "Loading...";
		if (isCurrentMonth) return "You cannot access the next month yet";
		return "Go to next month";
	}

	const [firstAddedHabit] = [...trackedHabits].sort((a, b) =>
		a.created_at.toString().localeCompare(b.created_at.toString()),
	);
	// Get the date of month that's currently displayed,
	// convert firstAddedHabit?.created_at to a format that date-fns understands,
	// and check if they are the same month
	const isTheMonthFirstHabbitWasAdded = isSameMonth(
		subMonths(new Date(), monthOffset),
		new Date(firstAddedHabit?.created_at),
	);
	const isPreviousButtonDisabled =
		getMonthRequestState.status === "loading" || isTheMonthFirstHabbitWasAdded;

	function getPreviousButtonTitle() {
		if (getMonthRequestState.status === "loading") return "Loading...";
		if (isTheMonthFirstHabbitWasAdded) return "There are no habits added in the previous month";
		return "Go to previous month";
	}

	return (
		<UI.Column mt="24" crossAxis="center">
			<UI.Row mb="24" bg="gray-2" px="72" py="12" width="auto">
				<UI.Button
					variant="outlined"
					onClick={widget.setPreviousMonth}
					disabled={isPreviousButtonDisabled}
					style={{width: "100px"}}
					title={getPreviousButtonTitle()}
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
					disabled={isNextButtonDisabled}
					style={{width: "100px"}}
					title={getNextButtonTitle()}
				>
					Next
				</UI.Button>
			</UI.Row>

			<UI.ShowIf request={getMonthRequestState} is="error">
				<UI.ErrorBanner my="24">{errorMessage}</UI.ErrorBanner>
			</UI.ShowIf>

			<UI.Card bg="gray-0" data-testid="calendar" style={habitDialogGrid} p="12">
				{dayCellsWithStats.map(props => (
					<Day
						key={props.day.toString()}
						refreshCalendar={() => getMonthRequestState.refetch({force: true})}
						{...props}
					/>
				))}
			</UI.Card>
		</UI.Column>
	);
};
