import {_internal_api} from "./api";
import {constructUrl} from "../hooks/useQueryParam";
import {formatDay} from "../services/date-formatter";

import {Journal, DraftJournal} from "../models";

export const getJournalRequest = async (_key: "journal", day: Journal["day"]) =>
	_internal_api
		.get<Journal>(constructUrl(`/journal`, {day: formatDay(day)}))
		.then(response => response.data);

export const updateJournalRequest = (newJournalPayload: DraftJournal) =>
	_internal_api
		.post<Journal>(`/journal`, {
			day: formatDay(newJournalPayload.day),
			content: newJournalPayload.content,
		})
		.then(response => response.data);

export const getJournalsRequest = async (_key: "journals") =>
	_internal_api.get<Journal[]>("/journals").then(response => response.data);
