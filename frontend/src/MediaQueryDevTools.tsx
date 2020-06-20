import React from "react";

import * as UI from "./ui";
import {useMediaQuery, useWindowSize} from "./ui/breakpoints";

declare const __ENVIRONMENT__: string;

export const MediaQueryDevTools = () => {
	const mediaQuery = useMediaQuery();
	const {width, height} = useWindowSize();

	return (
		<UI.Row style={{top: "var(--spacing-xl)", zIndex: -1}} position="absolute" ml="6" width="auto">
			{__ENVIRONMENT__ === "development" && (
				<UI.Text>
					W:{width}px H:{height}px ({mediaQuery})
				</UI.Text>
			)}
		</UI.Row>
	);
};
