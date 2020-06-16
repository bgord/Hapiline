import "./column.css";

import React from "react";
import {Box, PolymorphicComponentProps} from "react-polymorphic-box";

import {
	Widths,
	Positions,
	Borders,
	Alignments,
	Backgrounds,
	Margins,
	Paddings,
	getMarginTokens,
	getPaddingTokens,
	getAlignmentTokens,
	getPositionToken,
	getWidthToken,
	getBackgroundToken,
	getBorderTokens,
} from "../design-system";

type ColumnOwnProps = Margins & Alignments & Paddings & Widths & Positions & Backgrounds & Borders;

export type ColumnProps<E extends React.ElementType> = PolymorphicComponentProps<E, ColumnOwnProps>;

const defaultElement = "div";

// prettier-ignore
export const Column = React.forwardRef(
	<E extends React.ElementType = typeof defaultElement>(
		{
			ref,
			m, mx, my, mt, mr, mb, ml,
			p, px, py, pt, pr, pb, pl,
			mainAxis, crossAxis, crossAxisSelf,
			position = "static",
			width,
			bg,
			b, bx, by, bt, br, bb, bl, bw,
			...props
		}: ColumnProps<E>,
		innerRef: typeof ref,
	) => {
		const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
		const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});
		const alignmentTokens = getAlignmentTokens({mainAxis, crossAxis, crossAxisSelf});
		const positionToken = getPositionToken({position});
		const widthToken = getWidthToken({width});
		const backgroundToken = getBackgroundToken({bg});
		const borderTokens = getBorderTokens({b, bx, by, bt, br, bb, bl, bw});

		return (
			<Box
				as={defaultElement}
				className="c-column"
				ref={innerRef}
				{...marginTokens}
				{...paddingTokens}
				{...alignmentTokens}
				{...positionToken}
				{...widthToken}
				{...backgroundToken}
				{...borderTokens}
				{...props}
			/>
		);
	},
) as <E extends React.ElementType = typeof defaultElement>(props: ColumnProps<E>) => JSX.Element;
