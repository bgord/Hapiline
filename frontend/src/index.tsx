import "../css/index.css";

import * as React from "react";
import * as ReactDOM from "react-dom";

import {App} from "./App";
import {AuthProvider} from "./contexts/auth-context";

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<App />
		</AuthProvider>
	</React.StrictMode>,
	document.getElementById("root"),
);
