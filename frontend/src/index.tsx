import "../css/normalize.css";
import "@reach/dialog/styles.css";
import "@reach/tabs/styles.css";
import "@reach/skip-nav/styles.css";
import "../css/main.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as UI from "./ui";

import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";

import {App} from "./App";
import {AuthProvider} from "./contexts/auth-context";
import {ToastsProvider} from "./contexts/toasts-context";
import {DeveloperInfo} from "./DeveloperInfo";
import {OfflineIndicator} from "./OfflineIndicator";
import {MediaQueryDevTools} from "./MediaQueryDevTools";

declare const __BUILD_VERSION__: string;
declare const __ENVIRONMENT__: string;

declare const process: {
	env: {
		BUGSNAG_API_KEY: string;
	};
};

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
					<OfflineIndicator />
					<MediaQueryDevTools />
				</AuthProvider>
			</ToastsProvider>
		</ErrorBoundary>
	</React.StrictMode>,
	document.getElementById("root"),
);

if (
	"serviceWorker" in navigator &&
	// Comment the line below if you want to
	// use the service worker in development mode.
	// And uncomment the if statements for
	// debugging purposes.
	__ENVIRONMENT__ === "production"
) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/sw.js")
			.then(_registration => {
				// if (__ENVIRONMENT__ === "development") {
				// 	console.log("SW registered: ", _registration);
				// }
			})
			.catch(_registrationError => {
				// if (__ENVIRONMENT__ === "development") {
				// 	console.log("SW registration error: ", _registrationError);
				// }
			});
	});
}
