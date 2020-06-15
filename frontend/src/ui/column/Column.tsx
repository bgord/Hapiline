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
			p,
			px,
			py,
			pt,
			pr,
			pb,
			pl,
			mainAxis,
			crossAxis,
			width,
			bg,
			position = "static",
			bw,
			b,
			bx,
			by,
			bt,
			br,
			bb,
			bl,
			...props
		}: ColumnProps<E>,
		innerRef: typeof ref,
	) => {
		const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
		const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});

		return (
			<Box
				ref={innerRef}
				as={defaultElement}
				data-main-axis={mainAxis}
				data-cross-axis={crossAxis}
				data-width={width}
				data-position={position}
				data-bg={bg}
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
				{...props}
			/>
		);
	},
) as <E extends React.ElementType = typeof defaultElement>(props: ColumnProps<E>) => JSX.Element;
