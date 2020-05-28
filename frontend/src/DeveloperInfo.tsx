import React from "react";
import {useToggle} from "./hooks/useToggle";

import * as UI from "./ui";

declare const __BUILD_VERSION__: string;
declare const __BUILD_DATE__: string;

export const DeveloperInfo = () => {
	const [isVisible, , , toggleVisibility] = useToggle();

	return (
		<UI.Row position="fixed" style={{bottom: 0, height: "20px"}} onClick={toggleVisibility}>
			{isVisible && (
				<UI.Text variant="light">
					Version {__BUILD_VERSION__} built at {__BUILD_DATE__} (UTC)
				</UI.Text>
			)}
		</UI.Row>
	);
};
