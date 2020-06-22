import "./nav-item.css";

import React from "react";
import {NavLink, NavLinkProps} from "react-router-dom";
import * as UI from "../";
import {Paddings, getPaddingTokens} from "../design-system";

type NavItemProps = NavLinkProps & {variant?: UI.TextVariant} & Paddings;

export const NavItem: React.FC<NavItemProps> = ({
	variant = "semi-bold",
	p = "24",
	px,
	py,
	pt,
	pr,
	pb,
	pl,
	...props
}) => {
	const paddingTokens = getPaddingTokens({p, px, py, pt, pr, pb, pl});

	return (
		<NavLink
			className="c-text"
			activeClassName="c-active-nav-item"
			exact
			data-variant={variant}
			{...paddingTokens}
			{...props}
		/>
	);
};
