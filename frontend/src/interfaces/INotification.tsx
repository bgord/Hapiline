export type NotificationType = "success" | "error" | "info";

export interface INotification {
	id: number;
	type: NotificationType;
	message: string;
}
