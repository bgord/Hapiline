import "./card.css";

import React from "react";
import {Box, PolymorphicComponentProps} from "react-polymorphic-box";

import {
	Positions,
	Backgrounds,
	Margins,
	Paddings,
	Widths,
	ZIndexes,
	Overflows,
	OnEntryAnimations,
	getMarginTokens,
	getPaddingTokens,
	getPositionToken,
	getBackgroundToken,
	getWidthToken,
	getZIndexToken,
	getOverflowToken,
	getOnEntryAnimationToken,
} from "../design-system";

type CardOwnProps = Paddings &
	Margins &
	Positions &
	Backgrounds &
	Widths &
	ZIndexes &
	Overflows &
	OnEntryAnimations;

export type CardProps<E extends React.ElementType> = PolymorphicComponentProps<E, CardOwnProps>;

const defaultElement = "div";

// prettier-ignore
export const Card = React.forwardRef(
	<E extends React.ElementType = typeof defaultElement>(
		{
			ref,
			m, mx, my, mt, mr, mb, ml,
			p, px, py, pt, pr, pb, pl,
			position = "static",
			bg, width, z, overflow, onEntry,
			...props
		}: CardProps<E>,
		innerRef: typeof ref,
	) => {
		const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});
		const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});
		const positionToken = getPositionToken(position);
		const backgroundToken = getBackgroundToken(bg);
		const widthToken = getWidthToken(width);
		const zIndexToken = getZIndexToken(z);
		const overflowToken = getOverflowToken(overflow);
		const onEntryAnimationToken = getOnEntryAnimationToken(onEntry);

		return (
			<Box
				as={defaultElement}
				className="c-card"
				ref={innerRef}
				{...marginTokens}
				{...paddingTokens}
				{...positionToken}
				{...backgroundToken}
				{...widthToken}
				{...zIndexToken}
				{...overflowToken}
				{...onEntryAnimationToken}
				{...props}
			/>
		);
	},
) as <E extends React.ElementType = typeof defaultElement>(props: CardProps<E>) => JSX.Element;
