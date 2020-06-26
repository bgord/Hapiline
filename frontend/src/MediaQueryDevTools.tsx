import React from "react";

import * as UI from "./ui";
import {useMediaQuery, useWindowSize} from "./ui/breakpoints";

declare const __ENVIRONMENT__: string;

export const MediaQueryDevTools = () => {
	const mediaQuery = useMediaQuery();
	const {width, height} = useWindowSize();

	return (
		<UI.Row
			as="aside"
			aria-label="Media query dev tools"
			p="3"
			bg="gray-3"
			style={{top: 0, zIndex: 5}}
			position="absolute"
			width="auto"
		>
			{__ENVIRONMENT__ === "development" && (
				<UI.Text>
					W:{width}px H:{height}px ({mediaQuery})
				</UI.Text>
			)}
		</UI.Row>
	);
};
