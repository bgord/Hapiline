type Width = "auto" | "100%";
export interface Widths {
	width?: Width;
}

type Position = "relative" | "absolute" | "fixed" | "static";
export interface Positions {
	position?: Position;
}

type BorderWidth = "1" | "2" | "3";
type BorderColors = "gray-1" | "gray-2";
export type Borders = {
	bw?: BorderWidth;
	b?: BorderColors;
	bx?: BorderColors;
	by?: BorderColors;
	bt?: BorderColors;
	br?: BorderColors;
	bb?: BorderColors;
	bl?: BorderColors;
};

type MainAxisAlignment = "start" | "center" | "between" | "end";
type CrossAxisAlignment = "start" | "center" | "baseline" | "end";
type CrossAxisSelfAlignment = "start" | "end";
export interface Alignments {
	mainAxis?: MainAxisAlignment;
	crossAxis?: CrossAxisAlignment;
	crossAxisSelf?: CrossAxisSelfAlignment;
}

type Background =
	| "white"
	| "gray-0"
	| "gray-1"
	| "gray-2"
	| "gray-3"
	| "red"
	| "green"
	| "inherit"
	| "transparent";
export type Backgrounds = {
	bg?: Background;
};

type SpacingScale = "0" | "3" | "6" | "12" | "24" | "48" | "72" | "auto" | undefined;
export interface Margins {
	mt?: SpacingScale;
	mr?: SpacingScale;
	mb?: SpacingScale;
	ml?: SpacingScale;
	m?: SpacingScale;
	mx?: SpacingScale;
	my?: SpacingScale;
}
export interface Paddings {
	pt?: SpacingScale;
	pr?: SpacingScale;
	pb?: SpacingScale;
	pl?: SpacingScale;
	p?: SpacingScale;
	px?: SpacingScale;
	py?: SpacingScale;
}
