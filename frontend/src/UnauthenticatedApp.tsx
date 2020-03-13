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
	<nav>
		<UI.Row style={{background: "var(--gray-0)", borderBottom: "2px solid var(--gray-2)"}}>
			<NavLink className="ml-2 mr-auto px-4 py-2" exact activeClassName="text-blue-400" to="/">
				<Logo className="h-10" />
			</NavLink>
			<UI.NavItem to="/register">Register</UI.NavItem>
			<UI.NavItem to="/login">Login</UI.NavItem>
		</UI.Row>
	</nav>
);
