import * as Async from "react-async";

import {_internal_api} from "./api";

export interface AppNotification {
	id: number;
	type: "regular";
	status: "unread" | "read";
	content: string;
	user_id: number;
	created_at: string;
	updated_at: string;
}

export const getNotificationsRequest: Async.PromiseFn<AppNotification[]> = () =>
	_internal_api.get<AppNotification[]>("/notifications").then(response => response.data);
