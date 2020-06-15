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
} from "../design-system";

type ColumnOwnProps = Margins & Alignments & Paddings & Widths & Positions & Backgrounds & Borders;

export type ColumnProps<E extends React.ElementType> = PolymorphicComponentProps<E, ColumnOwnProps>;

const defaultElement = "div";

// prettier-ignore
export const Column = React.forwardRef(
	<E extends React.ElementType = typeof defaultElement>(
		{
			ref,
			bw,
			b,
			bx,
			by,
			bt,
			br,
			bb,
			bl,
			m, mx, my, mt, mr, mb, ml,
			p, px, py, pt, pr, pb, pl,
			mainAxis, crossAxis, crossAxisSelf,
			position = "static",
			width,
			bg,
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

		return (
			<Box
				ref={innerRef}
				as={defaultElement}
				data-bw={bw}
				data-b={b}
				data-bx={bx}
				data-by={by}
				data-bt={bt}
				data-br={br}
				data-bb={bb}
				data-bl={bl}
				className="c-column"
				{...marginTokens}
				{...paddingTokens}
				{...alignmentTokens}
				{...positionToken}
				{...widthToken}
				{...backgroundToken}
				{...props}
			/>
		);
	},
) as <E extends React.ElementType = typeof defaultElement>(props: ColumnProps<E>) => JSX.Element;
