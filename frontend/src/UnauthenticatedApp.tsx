import {Router, Route, Switch, Redirect, NavLink} from "react-router-dom";
import * as React from "react";

import {createBrowserHistory} from "history";

import * as UI from "./ui";
import {EmailVerificationWindow} from "./EmailVerificationWindow";
import {ForgotPasswordWindow} from "./ForgotPasswordWindow";
import {Home} from "./Home";
import {LoginWindow} from "./LoginWindow";
import {Logo} from "./Logo";
import {NewPasswordWindow} from "./NewPasswordWindow";
import {RegistrationWindow} from "./RegistrationWindow";

const unauthenticatedAppBrowserHistory = createBrowserHistory();

const UnauthenticatedApp = () => (
	<Router history={unauthenticatedAppBrowserHistory}>
		<main>
			<UI.Column width="100%" style={{height: "100vh"}}>
				<UnauthenticatedNavbar />
				<Switch>
					<Route exact path="/login">
						<LoginWindow />
					</Route>
					<Route exact path="/register">
						<RegistrationWindow />
					</Route>
					<Route exact path="/verify-email/:token">
						<EmailVerificationWindow />
					</Route>
					<Route exact path="/forgot-password">
						<ForgotPasswordWindow />
					</Route>
					<Route exact path="/new-password/:token">
						<NewPasswordWindow />
					</Route>
					<Route exact path="/">
						<Home />
					</Route>
					<Redirect to="/" />
				</Switch>
			</UI.Column>
		</main>
	</Router>
);

export default UnauthenticatedApp;

const UnauthenticatedNavbar = () => (
	<UI.Row as="nav" bg="gray-0" bw="2" bb="gray-2">
		<NavLink activeClassName="c-active-link" data-ml="12" data-mr="auto" exact to="/dashboard">
			<Logo />
		</NavLink>
		<UI.NavItem to="/register">Register</UI.NavItem>
		<UI.NavItem to="/login">Login</UI.NavItem>
	</UI.Row>
);
