export interface IMonthDay {
	day: string;
	styles: {gridColumnStart: React.CSSProperties["gridColumnStart"]};
}

export interface IDayVoteStatsFromAPI {
	day: string;
	createdHabitsCount: number;
	progressVotesCountStats: number;
	plateauVotesCountStats: number;
	regressVotesCountStats: number;
	nullVotesCountStats: number;
}

export type DayWithVoteStatsFromAPI = IMonthDay & Partial<IDayVoteStatsFromAPI>;

export type FullDayVoteStats = Omit<DayWithVoteStatsFromAPI, "styles"> & {
	noVotesCountStats: number;
};
