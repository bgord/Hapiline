import * as Async from "react-async";

import {_internal_api} from "./api";

export const getMonthRequest: Async.PromiseFn<{
	day: string;
	count: number;
}[]> = ({monthOffset}) =>
	_internal_api
		.get<{day: string; count: number}[]>(`/month?monthOffset=${monthOffset}`)
		.then(response => response.data);
