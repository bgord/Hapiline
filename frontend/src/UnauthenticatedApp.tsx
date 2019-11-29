import {Router, Route, Switch, Redirect, NavLink} from "react-router-dom";
import * as React from "react";

import {createBrowserHistory} from "history";

import {EmailVerificationWindow} from "./EmailVerificationWindow";
import {ForgotPasswordWindow} from "./ForgotPasswordWindow";
import {Home} from "./Home";
import {LoginWindow} from "./LoginWindow";
import {RegistrationWindow} from "./RegistrationWindow";
import {NewPasswordWindow} from "./NewPasswordWindow";

const unauthenticatedAppBrowserHistory = createBrowserHistory();

function UnauthenticatedApp() {
	return (
		<Router history={unauthenticatedAppBrowserHistory}>
			<main className="flex flex-col h-screen w-full bg-gray-200">
				<UnauthenticatedNavbar />
				<section className="mx-4">
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
				</section>
			</main>
		</Router>
	);
}

export default UnauthenticatedApp;

function UnauthenticatedNavbar() {
	return (
		<nav className="flex justify-end py-1 bg-white shadow-md mb-20">
			<NavLink
				className="ml-2 mr-auto px-4 py-2"
				exact
				activeClassName="text-blue-400"
				to="/"
			>
				LOGO
			</NavLink>
			<NavLink
				className="px-4 py-2"
				activeClassName="text-blue-400"
				to="/register"
			>
				Register
			</NavLink>
			<NavLink
				className="px-4 py-2"
				activeClassName="text-blue-400"
				to="/login"
			>
				Login
			</NavLink>
		</nav>
	);
}
