export type ToastType = "success" | "error";

export interface Toast {
	id: number;
	type: ToastType;
	message: string;
}
