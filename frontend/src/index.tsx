import "../css/index.css";

import * as React from "react";
import * as ReactDOM from "react-dom";

import {App} from "./App";
import {AuthProvider} from "./contexts/auth-context";
import {NotificationsProvider} from "./contexts/notifications-context";

ReactDOM.render(
	<React.StrictMode>
		<NotificationsProvider>
			<AuthProvider>
				<App />
			</AuthProvider>
		</NotificationsProvider>
	</React.StrictMode>,
	document.getElementById("root"),
);
