import "@reach/dialog/styles.css";
import "@reach/tabs/styles.css";
import "../css/index.css";
import "../css/main.css";

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as UI from "./ui";
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
				<UI.Row mainAxis="center" mt="72">
					<UI.Column>
						<UI.Text variant="bold">Something went wrong ;(</UI.Text>
						<UI.Button mt="24" variant="primary">
							Refresh
						</UI.Button>
					</UI.Column>
				</UI.Row>
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
