import React from "react";

import {Margins, getMarginTokens} from "../design-system";

export const labelToEmoji = {
	party: "🎉",
};

type EmojiProps = JSX.IntrinsicElements["span"] & {
	ariaLabel: string;
} & Margins;

export const Emoji: React.FC<EmojiProps> = ({ariaLabel, m, mx, my, mt, mr, mb, ml, ...props}) => {
	const marginTokens = getMarginTokens({m, mx, my, mt, mr, mb, ml});

	return <span aria-label={ariaLabel} role="img" {...marginTokens} {...props} />;
};
