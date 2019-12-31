export type NotificationType = "success" | "error" | "info";

export interface Notification {
	id: number;
	type: NotificationType;
	message: string;
}
