import React from "react";
import {Margins} from "../margins";

export const labelToEmoji = {
	party: "🎉",
};

type EmojiProps = JSX.IntrinsicElements["span"] & {
	ariaLabel: string;
} & Margins;

export const Emoji: React.FC<EmojiProps> = ({ariaLabel, m, mx, my, mt, mr, mb, ml, ...props}) => (
	<span
		data-m={m}
		data-mx={mx}
		data-my={my}
		data-mt={mt}
		data-mr={mr}
		data-mb={mb}
		data-ml={ml}
		{...props}
		aria-label={ariaLabel}
		role="img"
	/>
);
