import * as Async from "react-async";

import {_internal_api} from "./api";

export const getMonthRequest: Async.PromiseFn<void> = ({date}) =>
	_internal_api
		.get<void>(`/calendar/month?date=${date}`)
		.then(response => response.data);
