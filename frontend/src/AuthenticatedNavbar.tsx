import {NavLink, useHistory} from "react-router-dom";
import * as React from "react";

import * as UI from "./ui";
import {Logo} from "./Logo";
import {useUserProfile} from "./contexts/auth-context";
import {NotificationDropdown} from "./NotificationsDropdown";
import {useWindowWidth} from "./ui/breakpoints";
import {Menu, MenuList, MenuButton, MenuLink} from "@reach/menu-button";

import {useKeyboardShortcurts} from "./hooks/useKeyboardShortcuts";

export function AuthenticatedNavbar() {
	const history = useHistory();

	useKeyboardShortcurts({
		"Shift+KeyD": () => history.push("/dashboard"),
		"Shift+KeyH": () => history.push("/habits"),
		"Shift+KeyC": () => history.push("/calendar"),
		"Shift+KeyJ": () => history.push("/journals"),
		"Shift+KeyM": () => history.push("/profile"),
		"Shift+KeyL": () => history.push("/logout"),
	});

	const width = useWindowWidth();
	const shouldDisplayInlineMenu = width > 1050;

	return (
		<UI.Row as="nav" bg="gray-0" bw="2" bb="gray-2" p={shouldDisplayInlineMenu ? "0" : "6"}>
			<NavLink activeClassName="c-active-link" data-ml="12" data-mr="auto" exact to="/dashboard">
				<Logo />
			</NavLink>

			{shouldDisplayInlineMenu && <InlineMenu />}

			<NotificationDropdown />

			{shouldDisplayInlineMenu && (
				<UI.NavItem to="/logout" title={`Press "Shift + L"`}>
					Logout
				</UI.NavItem>
			)}

			{!shouldDisplayInlineMenu && <DropdownMenu />}
		</UI.Row>
	);
}

function InlineMenu() {
	const [profile] = useUserProfile();

	return (
		<>
			<UI.NavItem to="/dashboard" title={`Press "Shift + D"`}>
				Dashboard
			</UI.NavItem>
			<UI.NavItem to="/habits" title={`Press "Shift + H"`}>
				Habits
			</UI.NavItem>
			<UI.NavItem to="/calendar" title={`Press "Shift + C"`}>
				Calendar
			</UI.NavItem>
			<UI.NavItem to="/journals" title={`Press "Shift + J"`}>
				Journals
			</UI.NavItem>
			<UI.NavItem variant="bold" to="/profile" title={`Press "Shift + M"`}>
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

				<MenuLink as={UI.NavItem} p="12" to="/dashboard" title={`Press "Shift + D"`}>
					Dashboard
				</MenuLink>
				<MenuLink as={UI.NavItem} p="12" to="/habits" title={`Press "Shift + H"`}>
					Habits
				</MenuLink>
				<MenuLink as={UI.NavItem} p="12" to="/calendar" title={`Press "Shift + C"`}>
					Calendar
				</MenuLink>
				<MenuLink as={UI.NavItem} p="12" to="/journals" title={`Press "Shift + J"`}>
					Journals
				</MenuLink>

				<MenuLink as={UI.NavItem} p="12" to="/logout" title={`Press "Shift + L"`}>
					Logout
				</MenuLink>
			</UI.Card>
		</Menu>
	);
}
