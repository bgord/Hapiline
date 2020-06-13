import React from "react";
import {useToggle} from "./hooks/useToggle";

import * as UI from "./ui";
import {formatTime} from "./services/date-formatter";

declare const __BUILD_VERSION__: string;
declare const __BUILD_DATE__: string;
declare const __ENVIRONMENT__: string;

export const DeveloperInfo = () => {
	const {on: isVisible, toggle: toggleVisibility} = useToggle();

	return (
		<UI.Row position="fixed" style={{bottom: 0, height: "20px"}} onClick={toggleVisibility}>
			{isVisible && (
				<UI.Text variant="light">
					{String(__ENVIRONMENT__).toUpperCase()} v{__BUILD_VERSION__} built at{" "}
					{formatTime(__BUILD_DATE__)}
				</UI.Text>
			)}
		</UI.Row>
	);
};
