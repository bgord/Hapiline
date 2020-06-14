import React from "react";

import * as Storage from "ts-storage";

export function usePersistentState<T extends Storage.AllowedTypes>(
	key: string,
	defaultValue: T,
): [T, (value: T) => void] {
	const valueFromLocalStorage = getFromLocalStorage<T>(key, defaultValue);

	const [value, setValue] = React.useState<T>(valueFromLocalStorage ?? defaultValue);

	React.useEffect(() => {
		Storage.set(key, value);
	}, [key, value]);

	return [value, setValue];
}

function getFromLocalStorage<T extends Storage.AllowedTypes>(key: string, defaultValue: T) {
	return Storage.get(key, defaultValue).value;
}
