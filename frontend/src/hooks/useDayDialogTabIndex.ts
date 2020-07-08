import {TabsProps} from "@reach/tabs";

import {useQueryParam} from "./useQueryParam";

type DayDialogTabName = "habits" | "journal";

const dayDialogTabNameToIndex: {[key in DayDialogTabName]: number} = {
	habits: 0,
	journal: 1,
};

export function useDayDialogTabIndex(): [TabsProps["index"], TabsProps["onChange"]] {
	const [tabParam, setTabIndexParam] = useQueryParam("tab");

	const tabName = isDayDialogTabName(tabParam) ? tabParam : "habits";
	const tabIndex = dayDialogTabNameToIndex[tabName];

	function syncTabIndex(index: TabsProps["index"]) {
		if (index === dayDialogTabNameToIndex.journal) {
			setTabIndexParam("journal");
			return;
		}
		setTabIndexParam("habits");
	}

	return [tabIndex, syncTabIndex];
}

function isDayDialogTabName(value: unknown): value is DayDialogTabName {
	if (typeof value !== "string") return false;

	return Object.keys(dayDialogTabNameToIndex).includes(value);
}
