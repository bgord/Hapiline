import React from "react";
import {ErrorMessage} from "../frontend/src/ErrorMessages";
import {Demo} from "./_Demo";

export default {
	shortMessage: (
		<Demo>
			<ErrorMessage>An error occurred.</ErrorMessage>
		</Demo>
	),
	longMessage: (
		<Demo>
			<ErrorMessage>Request failed due to an unexpected error.</ErrorMessage>
		</Demo>
	),
};
