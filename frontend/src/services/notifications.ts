import * as Async from "react-async";

import {_internal_api} from "./api";
import {Notification, DraftNotificationPayload} from "../interfaces/index";

export const getNotificationsRequest: Async.PromiseFn<Notification[]> = () =>
	_internal_api.get<Notification[]>("/notifications").then(response => response.data);

export const updateNotificationRequest: Async.DeferFn<Notification> = ([
	{id, status},
]: DraftNotificationPayload[]) =>
	_internal_api
		.patch<Notification>(`/notification/${id}`, {status})
		.then(response => response.data);
