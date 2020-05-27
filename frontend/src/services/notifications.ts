import {_internal_api} from "./api";
import {Notification, DraftNotificationPayload} from "../interfaces/index";

export const getNotificationsRequest = (_key: "notifications") =>
	_internal_api.get<Notification[]>("/notifications").then(response => response.data);

export const updateNotificationRequest = (draftNotificationPayload: DraftNotificationPayload) =>
	_internal_api
		.patch<Notification>(`/notification/${draftNotificationPayload.id}`, {
			status: draftNotificationPayload.status,
		})
		.then(response => response.data);
