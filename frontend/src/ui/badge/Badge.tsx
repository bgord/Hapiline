import "./badge.css";

import React from "react";

type BadgeVariant = "positive" | "negative" | "neutral";

type BadgeProps = JSX.IntrinsicElements["div"] & {variant: BadgeVariant};

export const Badge: React.FC<BadgeProps> = ({variant, ...props}) => (
	<div data-variant={variant} className="c-badge" {...props} />
);
