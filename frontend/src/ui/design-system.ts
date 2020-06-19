type Width = "auto" | "100%";
export interface Widths {
	width?: Width;
}
export function getWidthToken({width}: Widths) {
	return {
		"data-width": width,
	};
}

type Position = "relative" | "absolute" | "fixed" | "static";
export interface Positions {
	position?: Position;
}
export function getPositionToken({position}: Positions) {
	return {
		"data-position": position,
	};
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
export function getBorderTokens(border: Borders) {
	return {
		"data-bw": border.bw,
		"data-b": border.b,
		"data-bx": border.bx,
		"data-by": border.by,
		"data-bt": border.bt,
		"data-br": border.br,
		"data-bb": border.bb,
		"data-bl": border.bl,
	};
}

type MainAxisAlignment = "start" | "center" | "between" | "end";
type CrossAxisAlignment = "start" | "center" | "baseline" | "end";
type CrossAxisSelfAlignment = "start" | "end";
export interface Alignments {
	mainAxis?: MainAxisAlignment;
	crossAxis?: CrossAxisAlignment;
	crossAxisSelf?: CrossAxisSelfAlignment;
}
export function getAlignmentTokens(alignments: Alignments) {
	return {
		"data-main-axis": alignments.mainAxis,
		"data-cross-axis": alignments.crossAxis,
		"data-cross-axis-self": alignments.crossAxisSelf,
	};
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
export function getBackgroundToken({bg}: Backgrounds) {
	return {
		"data-bg": bg,
	};
}

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
export function getMarginTokens(margins: Margins) {
	return {
		"data-m": margins.m,
		"data-mx": margins.mx,
		"data-my": margins.my,
		"data-mt": margins.mt,
		"data-mr": margins.mr,
		"data-mb": margins.mb,
		"data-ml": margins.ml,
	};
}
export function getPaddingTokens(paddings: Paddings) {
	return {
		"data-p": paddings.p,
		"data-px": paddings.px,
		"data-py": paddings.py,
		"data-pt": paddings.pt,
		"data-pr": paddings.pr,
		"data-pb": paddings.pb,
		"data-pl": paddings.pl,
	};
}
