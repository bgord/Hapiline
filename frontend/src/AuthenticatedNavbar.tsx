import {NavLink} from "react-router-dom";
import * as React from "react";

import * as UI from "./ui";
import {Logo} from "./Logo";
import {useUserProfile} from "./contexts/auth-context";
import {NotificationDropdown} from "./NotificationsDropdown";
import {useWindowWidth} from "./ui/breakpoints";
import {Menu, MenuList, MenuButton, MenuLink} from "@reach/menu-button";

export function AuthenticatedNavbar() {
	const width = useWindowWidth();
	const shouldDisplayInlineMenu = width > 1050;

	return (
		<UI.Row as="nav" bg="gray-0" bw="2" bb="gray-2" p={shouldDisplayInlineMenu ? "0" : "6"}>
			<NavLink activeClassName="c-active-link" data-ml="12" data-mr="auto" exact to="/dashboard">
				<Logo />
			</NavLink>

			{shouldDisplayInlineMenu && <InlineMenu />}

			<NotificationDropdown />

			{shouldDisplayInlineMenu && <UI.NavItem to="/logout">Logout</UI.NavItem>}

			{!shouldDisplayInlineMenu && <DropdownMenu />}
		</UI.Row>
	);
}

function InlineMenu() {
	const [profile] = useUserProfile();

	return (
		<>
			<UI.NavItem to="/dashboard">Dashboard</UI.NavItem>
			<UI.NavItem to="/habits">Habits</UI.NavItem>
			<UI.NavItem to="/calendar">Calendar</UI.NavItem>
			<UI.NavItem to="/journals">Journals</UI.NavItem>
			<UI.NavItem variant="bold" to="/profile">
				{profile?.email}
			</UI.NavItem>
		</>
	);
}

function DropdownMenu() {
	const [profile] = useUserProfile();

	return (
		<Menu>
			<MenuButton as={UI.Button} ml="12" variant="bare">
				<UI.Text>Menu</UI.Text>
			</MenuButton>

			<UI.Card onEntry="slide-down" as={MenuList} id="menu-list" data-bw="2" data-b="gray-2">
				<MenuLink as={UI.NavItem} p="12" to="/profile">
					<UI.Text variant="bold">{profile?.email}</UI.Text>
				</MenuLink>

				<MenuLink as={UI.NavItem} p="12" to="/dashboard">
					Dashboard
				</MenuLink>
				<MenuLink as={UI.NavItem} p="12" to="/habits">
					Habits
				</MenuLink>
				<MenuLink as={UI.NavItem} p="12" to="/calendar">
					Calendar
				</MenuLink>
				<MenuLink as={UI.NavItem} p="12" to="/journals">
					Journals
				</MenuLink>

				<MenuLink as={UI.NavItem} p="12" to="/logout">
					Logout
				</MenuLink>
			</UI.Card>
		</Menu>
	);
}
