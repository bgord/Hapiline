import {isSameMonth, subMonths} from "date-fns";
import {useQuery} from "react-query";
import React from "react";

import {CalendarDay} from "./CalendarDay";
import {Habit, DayCellWithFullStats, DayStatsFromServer, DayCell} from "../../models";
import {MEDIA_QUERY, useMediaQuery} from "../../ui/breakpoints";
import {api} from "../../services/api";
import {getHabitsAvailableAtThisDay} from "../../selectors/getHabitsAvailableAtDay";
import {getRequestStateErrors} from "../../selectors/getRequestErrors";
import {useDocumentTitle} from "../../hooks/useDocumentTitle";
import {useMonthsWidget, MonthOffset} from "../../hooks/useMonthsWidget";
import {useTrackedHabits} from "../../contexts/habits-context";
import * as UI from "../../ui";
import {useKeyboardShortcurts} from "../../hooks/useKeyboardShortcuts";
import {useQueryParams} from "../../hooks/useQueryParam";
import {UrlBuilder} from "../../services/url-builder";

export function CalendarWindow() {
	useDocumentTitle("Hapiline - calendar");

	const mediaQuery = useMediaQuery();

	const [, , updateUrl] = useQueryParams();
	useKeyboardShortcurts({
		"Shift+KeyT": () => updateUrl(UrlBuilder.calendar.today()),
	});

	const [widget, monthString, monthOffset] = useMonthsWidget();

	const getMonthRequestState = useQuery<DayStatsFromServer[], ["month", MonthOffset]>({
		queryKey: ["month", monthOffset],
		queryFn: api.calendar.getMonth,
		config: {
			staleTime: 60 * 1000, // 1 minute
			retry: false,
		},
	});
	const {errorMessage} = getRequestStateErrors(getMonthRequestState);

	const trackedHabits = useTrackedHabits();

	const dayStatsFromServer = getMonthRequestState.data;
	const appendStatsToEachDayOfTheMonth = appendStatsToEachDayOfTheMonthFactory(
		trackedHabits,
		dayStatsFromServer,
	);
	const dayCellsWithFullStats: DayCellWithFullStats[] = widget.daysOfTheMonth.map(
		appendStatsToEachDayOfTheMonth,
	);

	const isCurrentMonth = monthOffset === 0;
	const isNextButtonDisabled = getMonthRequestState.status === "loading" || isCurrentMonth;
	function getNextButtonTitle() {
		if (getMonthRequestState.status === "loading") return "Loading...";
		if (isCurrentMonth) return "You cannot access the next month yet";
		return "Go to next month";
	}

	const isCurrentMonthTheMonthTheFirstHabitWasOrCanBeAdded = checkIfCurrentMonthIsTheMonthTheFirstHabitWasOrCanBeAdded(
		monthOffset,
		trackedHabits,
	);
	const isPreviousButtonDisabled =
		getMonthRequestState.status === "loading" || isCurrentMonthTheMonthTheFirstHabitWasOrCanBeAdded;

	function getPreviousButtonTitle() {
		if (getMonthRequestState.status === "loading") return "Loading...";
		if (isCurrentMonthTheMonthTheFirstHabitWasOrCanBeAdded) {
			return "There are no habits added in the previous month";
		}
		return "Go to previous month";
	}

	return (
		<UI.Column
			as="main"
			mt={["24", "12"]}
			width={["100%", "auto"]}
			style={{maxWidth: "1520px"}}
			mx="auto"
			p="12"
		>
			<UI.Row mainAxis="center" mb="12" bg="gray-3" px={["72", "6"]} py="12">
				<UI.Button
					variant="outlined"
					onClick={widget.setPreviousMonth}
					disabled={isPreviousButtonDisabled}
					style={{width: "90px"}}
					title={getPreviousButtonTitle()}
					mr={["24", "6"]}
				>
					Previous
				</UI.Button>

				<UI.CalendarIcon />
				<UI.Text as="h1" wrap="no" ml="6" variant="bold">
					{monthString}
				</UI.Text>

				<UI.Button
					ml={["24", "6"]}
					variant="outlined"
					onClick={widget.setNextMonth}
					disabled={isNextButtonDisabled}
					style={{width: "90px"}}
					title={getNextButtonTitle()}
				>
					Next
				</UI.Button>
			</UI.Row>

			<UI.ShowIf request={getMonthRequestState} is="error">
				<UI.ErrorBanner my="24" p="6" mx="auto">
					{errorMessage || "Couldn't fetch calendar stats"}
				</UI.ErrorBanner>
			</UI.ShowIf>

			<UI.Card
				p="12"
				bg="gray-0"
				overflow="scroll"
				style={getCalendarGrid(mediaQuery)}
				data-testid="calendar"
			>
				{dayCellsWithFullStats.map(props => (
					<CalendarDay
						key={props.day.toString()}
						refreshCalendar={() => getMonthRequestState.refetch({force: true})}
						{...props}
					/>
				))}
			</UI.Card>
		</UI.Column>
	);
}

function getCalendarGrid(mediaQuery: MEDIA_QUERY): React.CSSProperties {
	return {
		// On default widths, we want to mantain the default calendar-esque style,
		// on lower we display days one under another.
		display: mediaQuery === MEDIA_QUERY.default ? "grid" : "block",
		gridTemplateColumns: "repeat(7, 200px)",
		gridTemplateRows: "repeat(6, 100px)",
		gridGap: "12px",
		width: "100%",
	};
}

function checkIfCurrentMonthIsTheMonthTheFirstHabitWasOrCanBeAdded(
	monthOffset: MonthOffset,
	trackedHabits: Habit[],
): boolean {
	// Get the date of month that's currently displayed,
	// convert firstAddedHabit?.created_at to a format that date-fns understands,
	// and check if they are the same month
	const currentlyDisplayedMonth = subMonths(new Date(), monthOffset);

	const firstAddedHabit = getFirstAddedHabit(trackedHabits);

	if (!firstAddedHabit) return true;

	const firstAddedHabitDate = new Date(firstAddedHabit.created_at);

	return isSameMonth(currentlyDisplayedMonth, firstAddedHabitDate);
}

function getFirstAddedHabit(trackedHabits: Habit[]): Habit {
	const [firstAddedHabit] = [...trackedHabits].sort((a, b) =>
		a.created_at.toString().localeCompare(b.created_at.toString()),
	);

	return firstAddedHabit;
}

function appendStatsToEachDayOfTheMonthFactory(
	trackedHabits: Habit[],
	dayStatsFromServer: DayStatsFromServer[] | undefined,
) {
	return function appendStatsToEachDayOfTheMonth(dayCell: DayCell) {
		const day = new Date(dayCell.day);

		const statsForTheDay = dayStatsFromServer?.find(item => item.day === dayCell.day);

		const numberOfCreatedHabits = statsForTheDay?.numberOfCreatedHabits || 0;
		const numberOfProgressVotes = statsForTheDay?.numberOfProgressVotes || 0;
		const numberOfPlateauVotes = statsForTheDay?.numberOfPlateauVotes || 0;
		const numberOfRegressVotes = statsForTheDay?.numberOfRegressVotes || 0;

		const numberOfHabitsAvailableAtThisDay = getHabitsAvailableAtThisDay(trackedHabits, day).length;

		const numberOfMissingVotes =
			numberOfHabitsAvailableAtThisDay -
			numberOfProgressVotes -
			numberOfPlateauVotes -
			numberOfRegressVotes;

		return {
			day: dayCell.day,
			styles: dayCell.styles,
			numberOfCreatedHabits,
			numberOfProgressVotes,
			numberOfPlateauVotes,
			numberOfRegressVotes,
			numberOfMissingVotes,
		};
	};
}
