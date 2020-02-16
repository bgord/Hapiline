import "@reach/dialog/styles.css";
import "../css/index.css";
import "../css/main.css";

import * as React from "react";
import * as ReactDOM from "react-dom";

import {Button} from "./ui/button/Button";
import {App} from "./App";
import {AuthProvider} from "./contexts/auth-context";
import {NotificationsProvider} from "./contexts/notifications-context";

class ErrorBoundary extends React.Component<{}, {hasError: boolean}> {
	constructor(props: {}) {
		super(props);
		this.state = {hasError: false};
	}

	componentDidCatch() {
		this.setState({hasError: true});
	}

	render() {
		if (this.state.hasError) {
			return (
				<>
					<h1 className="mt-10 text-center">Something went wrong :(</h1>
					<div className="flex justify-center mt-4 items-baseline">
						<Button variant="primary" onClick={() => window.location.reload(true)}>
							Refresh
						</Button>
						the page
					</div>
				</>
			);
		}

		return this.props.children;
	}
}

ReactDOM.render(
	<React.StrictMode>
		<ErrorBoundary>
			<NotificationsProvider>
				<AuthProvider>
					<App />
				</AuthProvider>
			</NotificationsProvider>
		</ErrorBoundary>
	</React.StrictMode>,
	document.getElementById("root"),
);
