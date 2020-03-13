import "./nav-link.css";

import React from "react";
import {NavLink, NavLinkProps} from "react-router-dom";

export const NavItem: React.FC<NavLinkProps> = props => (
	<NavLink
		data-variant="semi-bold"
		data-p="24"
		className="c-text"
		activeClassName="c-active-nav-link"
		exact
		{...props}
	/>
);
