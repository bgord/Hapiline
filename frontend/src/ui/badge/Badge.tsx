import "./badge.css";

import React from "react";

export type BadgeVariant = "positive" | "negative" | "neutral" | "light" | "normal" | "strong";

type BadgeProps = JSX.IntrinsicElements["div"] & {variant: BadgeVariant};

export const Badge: React.FC<BadgeProps> = ({variant, ...props}) => (
	<div data-variant={variant} className="c-badge" {...props} />
);
