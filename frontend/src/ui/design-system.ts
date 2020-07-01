type Width = "auto" | "100%" | "view-m" | "view-l";
type ResponsiveWidth = Width | [Width, Width];
export interface Widths {
	width?: ResponsiveWidth;
}
export function getWidthToken(width?: ResponsiveWidth) {
	if (Array.isArray(width)) {
		return {
			"data-width": width[0],
			"data-lg-width": width[1],
		};
	}
	return {
		"data-width": width,
	};
}

type Position = "relative" | "absolute" | "fixed" | "static";
export interface Positions {
	position?: Position;
}
export function getPositionToken(position?: Position) {
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

type Wrap = "nowrap" | "wrap" | "wrap-reverse" | undefined;
type ResponsiveWrap = Wrap | [Wrap, Wrap];
export interface Wraps {
	wrap?: ResponsiveWrap;
}
export function getWrapToken(wrap: ResponsiveWrap) {
	if (Array.isArray(wrap)) {
		return {
			"data-wrap": wrap[0],
			"data-lg-wrap": wrap[1],
		};
	}
	return {
		"data-wrap": wrap,
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
export function getBackgroundToken(bg?: Background) {
	return {
		"data-bg": bg,
	};
}

type ZIndex = "0" | "1" | "2";
export type ZIndexes = {
	z?: ZIndex;
};
export function getZIndexToken(z?: ZIndex) {
	return {
		"data-z": z,
	};
}

type Overflow = "auto" | "scroll";
export type Overflows = {
	overflow?: Overflow;
};
export function getOverflowToken(overflow?: Overflow) {
	return {
		"data-overflow": overflow,
	};
}

type SpacingScale = "0" | "3" | "6" | "12" | "24" | "48" | "72" | "auto" | undefined;
type ResponsiveSpacingScaleType = SpacingScale | [SpacingScale, SpacingScale];
export interface Margins {
	mt?: ResponsiveSpacingScaleType;
	mr?: ResponsiveSpacingScaleType;
	mb?: ResponsiveSpacingScaleType;
	ml?: ResponsiveSpacingScaleType;
	m?: ResponsiveSpacingScaleType;
	mx?: ResponsiveSpacingScaleType;
	my?: ResponsiveSpacingScaleType;
}
export interface Paddings {
	pt?: SpacingScale;
	pr?: SpacingScale;
	pb?: SpacingScale;
	pl?: ResponsiveSpacingScaleType;
	p?: ResponsiveSpacingScaleType;
	px?: ResponsiveSpacingScaleType;
	py?: SpacingScale;
}
export function getMarginTokens(margins: Margins) {
	function getSingleMarginToken(key: keyof Margins) {
		if (Array.isArray(margins[key])) {
			return {
				[`data-${key}`]: margins?.[key]?.[0],
				[`data-lg-${key}`]: margins?.[key]?.[1],
			};
		}
		return {[`data-${key}`]: margins[key]};
	}

	return {
		...getSingleMarginToken("m"),
		...getSingleMarginToken("mx"),
		...getSingleMarginToken("my"),
		...getSingleMarginToken("mt"),
		...getSingleMarginToken("mr"),
		...getSingleMarginToken("mb"),
		...getSingleMarginToken("ml"),
	};
}

export function getPaddingTokens(paddings: Paddings) {
	function getSinglePaddingToken(key: keyof Paddings) {
		if (Array.isArray(paddings[key])) {
			return {
				[`data-${key}`]: paddings?.[key]?.[0],
				[`data-lg-${key}`]: paddings?.[key]?.[1],
			};
		}
		return {[`data-${key}`]: paddings[key]};
	}
	return {
		...getSinglePaddingToken("p"),
		...getSinglePaddingToken("px"),
		"data-py": paddings.py,
		"data-pt": paddings.pt,
		"data-pr": paddings.pr,
		"data-pb": paddings.pb,
		...getSinglePaddingToken("pl"),
	};
}

type OnEntryAnimation = "slide-down";
export interface OnEntryAnimations {
	onEntry?: OnEntryAnimation;
}
export function getOnEntryAnimationToken(onEntry?: OnEntryAnimation) {
	return {
		"data-on-entry": onEntry,
	};
}
