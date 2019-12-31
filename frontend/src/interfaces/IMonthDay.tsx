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

export type FullDayWithVoteStatsFromAPI = IMonthDay & Partial<IDayVoteStatsFromAPI>;

export type FullDayWithVoteStats = IMonthDay &
	Partial<IDayVoteStatsFromAPI> & {
		noVotesCountStats: number;
	};

export type DayVoteStats = Omit<FullDayWithVoteStatsFromAPI, "styles"> & {
	noVotesCountStats: number;
};
