import React from "react";

type OnlineStatus = boolean;

export const useOnlineStatus = (): OnlineStatus => {
	const [isOnline, setIsOnline] = React.useState<OnlineStatus>(() => getOnlineStatus());

	React.useEffect(() => {
		function handleOnline() {
			setIsOnline(true);
		}

		function handleOffline() {
			setIsOnline(false);
		}

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	return isOnline;
};

// Check if browser supports `navigator.onLine`,
// otherwise, we assume the user is online.
function getOnlineStatus(): OnlineStatus {
	return typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
		? navigator.onLine
		: true;
}
