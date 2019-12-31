export interface IMonthDay {
	day: string;
	styles: {gridColumnStart: number | undefined};
	createdHabitsCount?: number;
	progressVotesCountStats?: number;
	plateauVotesCountStats?: number;
	regressVotesCountStats?: number;
	noVotesCountStats?: number;
}
