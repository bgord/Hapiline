import "./nav-item.css";

import React from "react";
import {NavLink, NavLinkProps} from "react-router-dom";
import * as UI from "../";

type NavItemProps = NavLinkProps & {variant?: UI.TextVariant};

export const NavItem: React.FC<NavItemProps> = ({variant = "semi-bold", ...props}) => (
	<NavLink
		data-p="24"
		className="c-text"
		activeClassName="c-active-nav-item"
		exact
		data-variant={variant}
		{...props}
	/>
);