import {DayStats} from "./index";

export interface IMonthDay {
	day: string;
	styles: {gridColumnStart: React.CSSProperties["gridColumnStart"]};
}

export type FullDayWithVoteStatsFromAPI = IMonthDay & Partial<DayStats>;

export type FullDayWithVoteStats = IMonthDay &
	Partial<DayStats> & {
		noVotesCountStats: number;
	};

export type DayVoteStats = Omit<FullDayWithVoteStatsFromAPI, "styles"> & {
	noVotesCountStats: number;
};
