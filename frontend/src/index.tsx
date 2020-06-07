import "../css/normalize.css";
import "@reach/dialog/styles.css";
import "@reach/tabs/styles.css";
import "../css/main.css";

import * as React from "react";
import * as ReactDOM from "react-dom";

import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import {__BUILD_VERSION__, __ENVIRONMENT__, process} from "./interfaces/build_vars";

import * as UI from "./ui";
import {App} from "./App";
import {AuthProvider} from "./contexts/auth-context";
import {ToastsProvider} from "./contexts/toasts-context";
import {DeveloperInfo} from "./DeveloperInfo";

Bugsnag.start({
	apiKey: process.env.BUGSNAG_API_KEY,
	plugins: [new BugsnagPluginReact()],
	collectUserIp: false,
	enabledReleaseStages: ["production"],
	appVersion: __BUILD_VERSION__,
	releaseStage: __ENVIRONMENT__,
});

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const ErrorBoundary = Bugsnag!.getPlugin("react")!.createErrorBoundary(React);

const FallbackComponent = () => (
	<UI.Row mainAxis="center" mt="72">
		<UI.Column>
			<UI.Text variant="bold">Something went wrong ;(</UI.Text>
			<UI.Button mt="24" variant="primary">
				Refresh
			</UI.Button>
		</UI.Column>
	</UI.Row>
);

ReactDOM.render(
	<React.StrictMode>
		<ErrorBoundary FallbackComponent={FallbackComponent}>
			<ToastsProvider>
				<AuthProvider>
					<App />
					<DeveloperInfo />
				</AuthProvider>
			</ToastsProvider>
		</ErrorBoundary>
	</React.StrictMode>,
	document.getElementById("root"),
);
