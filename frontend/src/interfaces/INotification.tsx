export type NotificationType = "success" | "error";

export interface INotification {
	id: number;
	type: NotificationType;
	message: string;
}
