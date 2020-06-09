import {Dialog} from "@reach/dialog";
import {useLocation} from "react-router-dom";
import React from "react";
import * as UI from "./ui";
import {Tabs, TabList, Tab, TabPanels, TabPanel} from "@reach/tabs";
import {DayCellWithFullStats} from "./interfaces/index";
import {useQueryParams} from "./hooks/useQueryParam";
import {format} from "date-fns";
import {useDocumentTitle} from "./hooks/useDocumentTitle";
import {HabitTab} from "./HabitTab";
import {JournalTab} from "./JournalTab";
type DayDialogProps = Omit<
	DayCellWithFullStats,
	"styles" | "createdHabitsCount" | "nullVotesCountStats"
> & {
	onResolve: VoidFunction;
};

export const DayDialog: React.FC<DayDialogProps> = ({day, onResolve, ...stats}) => {
	useDocumentTitle(`Hapiline - ${day}`);
	const location = useLocation<{from: string | undefined}>();
	const [, updateQueryParams] = useQueryParams();

	function dismissDialog() {
		updateQueryParams(location?.state?.from ?? location.pathname, {});
	}

	const dayName = format(new Date(day), "iiii");

	return (
		<Dialog
			aria-label="Show day preview"
			onDismiss={dismissDialog}
			style={{maxHeight: "700px", paddingBottom: "48px", overflow: "auto"}}
		>
			<UI.Row bg="gray-1" p="24" mainAxis="between">
				<UI.Header variant="small">
					{day} - {dayName}
				</UI.Header>
				<UI.CloseIcon onClick={dismissDialog} />
			</UI.Row>

			<Tabs data-mt="24" defaultIndex={0}>
				<TabList>
					<Tab data-variant="bare" className="c-button">
						Habits
					</Tab>
					<Tab data-variant="bare" className="c-button" data-ml="12">
						Journal
					</Tab>
				</TabList>
				<TabPanels data-mt="12">
					<TabPanel>
						<HabitTab day={day} onResolve={onResolve} {...stats} />
					</TabPanel>
					<TabPanel>
						<JournalTab />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Dialog>
	);
};
