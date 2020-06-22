import {Router, Route, Switch, Redirect, NavLink} from "react-router-dom";
import * as React from "react";

import {createBrowserHistory} from "history";

import * as UI from "./ui";
import {Calendar} from "./Calendar";
import {DashboardWindow} from "./windows/dashboard/DashboardWindow";
import {HabitsProvider} from "./contexts/habits-context";
import {HabitsWindow} from "./HabitsWindow";
import {Logo} from "./Logo";
import {Logout} from "./Logout";
import {Toasts} from "./Toasts";
import {useUserProfile} from "./contexts/auth-context";
import {ProfileWindow} from "./windows/profile/ProfileWindow";
import {NotificationDropdown} from "./NotificationsDropdown";
import {useWindowWidth} from "./ui/breakpoints";
import {useToggle} from "./hooks/useToggle";

const authenticatedAppBrowserHistory = createBrowserHistory();

function AuthenticatedApp() {
	return (
		<HabitsProvider>
			<Router history={authenticatedAppBrowserHistory}>
				<AuthenticatedNavbar />
				<Toasts />
				<Switch>
					<Route exact path="/logout">
						<Logout />
					</Route>
					<Route exact path="/habits">
						<HabitsWindow />
					</Route>
					<Route exact path="/calendar">
						<Calendar />
					</Route>
					<Route exact path="/dashboard">
						<DashboardWindow />
					</Route>
					<Route exact path="/profile">
						<ProfileWindow />
					</Route>
					<Redirect to="/dashboard" />
				</Switch>
			</Router>
		</HabitsProvider>
	);
}

export default AuthenticatedApp;

function AuthenticatedNavbar() {
	const [profile] = useUserProfile();

	const width = useWindowWidth();
	const shouldMenuBeCollapsed = width <= 1000;

	const {on: isMenuVisible, toggle: toggleMenuVisibility} = useToggle(false);

	return (
		<UI.Row as="nav" bg="gray-0" bw="2" bb="gray-2" p={shouldMenuBeCollapsed ? "6" : "0"}>
			<NavLink activeClassName="c-active-link" data-ml="12" data-mr="auto" exact to="/dashboard">
				<Logo />
			</NavLink>

			{!shouldMenuBeCollapsed && (
				<>
					<UI.NavItem to="/dashboard">Dashboard</UI.NavItem>
					<UI.NavItem to="/habits">Habits</UI.NavItem>
					<UI.NavItem to="/calendar">Calendar</UI.NavItem>
					<UI.NavItem variant="bold" to="/profile">
						{profile?.email}
					</UI.NavItem>
				</>
			)}

			<NotificationDropdown />

			{!shouldMenuBeCollapsed && <UI.NavItem to="/logout">Logout</UI.NavItem>}

			{shouldMenuBeCollapsed && (
				<UI.Column>
					<UI.Button
						ml="12"
						variant="bare"
						style={{position: "relative"}}
						onClick={toggleMenuVisibility}
					>
						<UI.VisuallyHidden>Menu dropdown</UI.VisuallyHidden>
						<UI.Text>Menu</UI.Text>
					</UI.Button>

					{isMenuVisible && (
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
									<UI.CloseIcon ml="auto" onClick={toggleMenuVisibility} />
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
			)}
		</UI.Row>
	);
}
