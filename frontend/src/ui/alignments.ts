type MainAxisAlignment = "start" | "center" | "between" | "end";
type CrossAxisAlignment = "start" | "center" | "baseline" | "end";

export interface Alignments {
	mainAxis?: MainAxisAlignment;
	crossAxis?: CrossAxisAlignment;
}
