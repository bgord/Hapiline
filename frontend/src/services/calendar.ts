import * as Async from "react-async";

import {_internal_api} from "./api";

export const getMonthRequest: Async.PromiseFn<void> = ({monthOffset}) =>
	_internal_api
		.get<void>(`/months/${monthOffset}`)
		.then(response => response.data);
