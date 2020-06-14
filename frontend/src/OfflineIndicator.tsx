import React from "react";
import {useOnlineStatus} from "./hooks/useOnlineStatus";
import * as UI from "./ui";

export const OfflineIndicator = () => {
	const isOnline = useOnlineStatus();

	const width = 400; // px

	if (isOnline) return null;

	return (
		<UI.ErrorBanner
			my="12"
			position="fixed"
			size="big"
			style={{
				bottom: 0,
				width,
				left: `calc(50% - ${width / 2}px)`,
				right: `calc(50% - ${width / 2}px)`,
			}}
		>
			You seem to be offline. <br />
			Please, check your internet connection.
		</UI.ErrorBanner>
	);
};
