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

type SpacingScale = "0" | "3" | "6" | "12" | "24" | "48" | "72" | "auto" | undefined;
type ResponsiveSpacingScaleType = SpacingScale | [SpacingScale, SpacingScale];
export interface Margins {
	mt?: ResponsiveSpacingScaleType;
	mr?: ResponsiveSpacingScaleType;
	mb?: SpacingScale;
	ml?: ResponsiveSpacingScaleType;
	m?: SpacingScale;
	mx?: ResponsiveSpacingScaleType;
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
	const mx = Array.isArray(margins.mx)
		? {
				"data-mx": margins.mx[0],
				"data-lg-mx": margins.mx[1],
		  }
		: {"data-mx": margins.mx};

	const mt = Array.isArray(margins.mt)
		? {
				"data-mt": margins.mt[0],
				"data-lg-mt": margins.mt[1],
		  }
		: {"data-mt": margins.mt};

	const ml = Array.isArray(margins.ml)
		? {
				"data-ml": margins.ml[0],
				"data-lg-ml": margins.ml[1],
		  }
		: {"data-ml": margins.ml};

	const mr = Array.isArray(margins.mr)
		? {
				"data-mr": margins.mr[0],
				"data-lg-mr": margins.mr[1],
		  }
		: {"data-mr": margins.mr};

	return {
		"data-m": margins.m,
		...mx,
		"data-my": margins.my,
		...mt,
		...mr,
		"data-mb": margins.mb,
		...ml,
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
