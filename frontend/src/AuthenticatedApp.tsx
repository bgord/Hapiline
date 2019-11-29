import {Router, Route, Switch, Redirect, NavLink} from "react-router-dom";
import * as React from "react";

import {createBrowserHistory} from "history";

import {Logo} from "./Logo";
import {Logout} from "./Logout";

const authenticatedAppBrowserHistory = createBrowserHistory();

function AuthenticatedApp() {
	return (
		<Router history={authenticatedAppBrowserHistory}>
			<main className="flex flex-col h-screen w-full bg-gray-200">
				<AuthenticatedNavbar />
				<section className="mx-4">
					<Switch>
						<Route exact path="/logout">
							<Logout />
						</Route>
						<Route exact path="/dashboard">
							<div>Welcome to dashboard</div>
						</Route>
						<Redirect to="/dashboard" />
					</Switch>{" "}
				</section>
			</main>
		</Router>
	);
}

export default AuthenticatedApp;

function AuthenticatedNavbar() {
	return (
		<nav className="flex justify-end py-1 bg-white shadow-md mb-4">
			<NavLink
				className="ml-2 mr-auto p-2"
				exact
				activeClassName="text-blue-400"
				to="/dashboard"
			>
				<Logo />
			</NavLink>
			<NavLink className="p-4" activeClassName="text-blue-400" to="/logout">
				Logout
			</NavLink>
		</nav>
	);
}
