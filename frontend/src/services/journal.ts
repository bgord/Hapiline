import {_internal_api} from "./api";
import {constructUrl} from "../hooks/useQueryParam";
import {formatDay} from "../services/date-formatter";

import {
    Journal,
    NewJournalRequest
} from "../models";

export const getJournalRequest = async (_key: "journal", day: Journal["day"]) =>
    _internal_api
    .get<Journal>(constructUrl(`/journal`, {day: formatDay(day)})).then(response=> response.data)
export const updateJournalRequest = (newJournalPayload: NewJournalRequest) =>
    _internal_api
    .post<Journal>(constructUrl(`/journal`,{day: formatDay(newJournalPayload.day), content: newJournalPayload?.content})).then(response=> response.data)

