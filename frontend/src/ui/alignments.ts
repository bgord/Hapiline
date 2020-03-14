type MainAxisAlignment = "start" | "center" | "between" | "end";
type CrossAxisAlignment = "start" | "center" | "baseline" | "end";
type CrossAxisSelfAlignment = "start" | "end";

export interface Alignments {
	mainAxis?: MainAxisAlignment;
	crossAxis?: CrossAxisAlignment;
	crossAxisSelf?: CrossAxisSelfAlignment;
}
