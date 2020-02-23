import {Router, Route, Switch, Redirect, NavLink} from "react-router-dom";
import * as React from "react";

import {createBrowserHistory} from "history";

import {EmailVerificationWindow} from "./EmailVerificationWindow";
import {ForgotPasswordWindow} from "./ForgotPasswordWindow";
import {Home} from "./Home";
import {LoginWindow} from "./LoginWindow";
import {Logo} from "./Logo";
import {NewPasswordWindow} from "./NewPasswordWindow";
import {RegistrationWindow} from "./RegistrationWindow";

const unauthenticatedAppBrowserHistory = createBrowserHistory();

function UnauthenticatedApp() {
	return (
		<Router history={unauthenticatedAppBrowserHistory}>
			<main className="flex flex-col h-screen w-full">
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
			</main>
		</Router>
	);
}

export default UnauthenticatedApp;

function UnauthenticatedNavbar() {
	return (
		<nav className="flex justify-end py-1 bg-white shadow-md mb-20">
			<NavLink className="ml-2 mr-auto px-4 py-2" exact activeClassName="text-blue-400" to="/">
				<Logo className="h-10" />
			</NavLink>
			<NavLink className="p-4" activeClassName="text-blue-400" to="/register">
				Register
			</NavLink>
			<NavLink className="p-4" activeClassName="text-blue-400" to="/login">
				Login
			</NavLink>
		</nav>
	);
}
