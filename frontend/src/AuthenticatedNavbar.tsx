import {NavLink} from "react-router-dom";
import * as React from "react";
import VisuallyHidden from "@reach/visually-hidden";

import * as UI from "./ui";
import {Logo} from "./Logo";
import {useUserProfile} from "./contexts/auth-context";
import {NotificationDropdown} from "./NotificationsDropdown";
import {useWindowWidth} from "./ui/breakpoints";
import {useToggle} from "./hooks/useToggle";

export function AuthenticatedNavbar() {
	const width = useWindowWidth();
	const shouldDisplayStandardMenu = width > 1000;

	if (shouldDisplayStandardMenu) {
	}

	return (
		<UI.Row as="nav" bg="gray-0" bw="2" bb="gray-2" p={shouldDisplayStandardMenu ? "0" : "6"}>
			<NavLink activeClassName="c-active-link" data-ml="12" data-mr="auto" exact to="/dashboard">
				<Logo />
			</NavLink>

			{shouldDisplayStandardMenu && <StandardMenu />}

			<NotificationDropdown />

			{shouldDisplayStandardMenu && <UI.NavItem to="/logout">Logout</UI.NavItem>}

			{!shouldDisplayStandardMenu && <DropdownMenu />}
		</UI.Row>
	);
}

function StandardMenu() {
	const [profile] = useUserProfile();

	return (
		<>
			<UI.NavItem to="/dashboard">Dashboard</UI.NavItem>
			<UI.NavItem to="/habits">Habits</UI.NavItem>
			<UI.NavItem to="/calendar">Calendar</UI.NavItem>
			<UI.NavItem variant="bold" to="/profile">
				{profile?.email}
			</UI.NavItem>
		</>
	);
}

function DropdownMenu() {
	const [profile] = useUserProfile();

	const {on: isDropdownMenuVisible, toggle: toggleDropdownMenu} = useToggle(false);

	return (
		<UI.Column>
			<UI.Button ml="12" variant="bare" style={{position: "relative"}} onClick={toggleDropdownMenu}>
				<VisuallyHidden>Menu dropdown</VisuallyHidden>
				<UI.Text>Menu</UI.Text>
			</UI.Button>

			{isDropdownMenuVisible && (
				<UI.Card
					mt="72"
					id="menu-list"
					position="absolute"
					width="auto"
					style={{
						right: "18px",
						maxHeight: "450px",
						overflowY: "auto",
					}}
				>
					<UI.Column>
						<UI.Row mainAxis="between" mb="6" p="6">
							<UI.Header variant="extra-small">Menu</UI.Header>
							<UI.CloseIcon ml="auto" onClick={toggleDropdownMenu} />
						</UI.Row>

						<UI.Column>
							<UI.NavItem variant="bold" to="/profile">
								{profile?.email}
							</UI.NavItem>

							<UI.NavItem to="/dashboard">Dashboard</UI.NavItem>
							<UI.NavItem to="/habits">Habits</UI.NavItem>
							<UI.NavItem to="/calendar">Calendar</UI.NavItem>

							<UI.NavItem to="/logout">Logout</UI.NavItem>
						</UI.Column>
					</UI.Column>
				</UI.Card>
			)}
		</UI.Column>
	);
}
