import React from "react";
import {useQuery, useMutation} from "react-query";
import * as UI from "./ui";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";
import {api} from "./services/api";
import {Journal, DraftJournal} from "./models";
import {Prompt} from "react-router-dom";
import {getRequestStateErrors, getRequestErrors} from "./selectors/getRequestErrors";

interface JournalProps {
	day: Date;
}
export const JournalTab: React.FC<JournalProps> = ({day}) => {
	const [journalContent, setJournalContent] = React.useState<Journal["content"]>("");

	const triggerErrorToast = useErrorToast();
	const triggerSuccessToast = useSuccessToast();

	const getJournalRequestState = useQuery<Journal, ["journal", Journal["day"]]>({
		queryKey: ["journal", day],
		queryFn: api.journal.show,
		config: {
			retry: false,
			onError: error => {
				const {responseStatus} = getRequestErrors(error as Error);
				if (responseStatus !== 404) {
					triggerErrorToast("Error while loading daily jorunal");
				}
			},
		},
	});
	const {responseStatus} = getRequestStateErrors(getJournalRequestState);

	const [journalRequestState, saveJournalRequestState] = useMutation<Journal, DraftJournal>(
		api.journal.post,
		{
			onSuccess: () => {
				getJournalRequestState.refetch();
				triggerSuccessToast("Daily journal successfully updated!");
			},
			onError: () => triggerErrorToast("Error while updating daily jorunal"),
		},
	);

	const handleSaveRequest = () => {
		journalRequestState({
			day,
			content: journalContent,
		});
	};
	const journal = getJournalRequestState.data;

	React.useEffect(() => {
		setJournalContent(journal?.content ?? "");
	}, [journal]);

	function shouldTriggerNotSavedChangesPrompt() {
		if (journal?.content !== undefined) {
			return journal?.content !== journalContent;
		}

		return journalContent !== "";
	}

	return (
		<UI.Column p="24">
			<Prompt
				when={shouldTriggerNotSavedChangesPrompt()}
				message="Are you sure? You will lose the changes to your journal."
			/>

			<JournalSyncStatus
				currentJournalContent={journal?.content}
				newJournalContent={journalContent}
			/>

			<UI.Field width="100%">
				<UI.Label htmlFor="journal">Journal</UI.Label>
				<UI.Textarea
					style={{minHeight: "400px"}} //TODO: Adjust to new solution
					id="journal"
					onChange={e => setJournalContent(e.target.value)}
					value={journalContent}
					disabled={getJournalRequestState.status === "error" && responseStatus !== 404}
				/>
				<UI.Button
					mt="24"
					onClick={handleSaveRequest}
					variant="primary"
					disabled={!shouldTriggerNotSavedChangesPrompt()}
				>
					Save
				</UI.Button>

				<UI.ShowIf request={saveJournalRequestState} is="error">
					<UI.ErrorBanner m="24">Couldn't save daily journal, please try again.</UI.ErrorBanner>
				</UI.ShowIf>
				{responseStatus !== 404 && (
					<UI.ShowIf request={getJournalRequestState} is="error">
						<UI.ErrorBanner m="24">Error while loading daily jorunal.</UI.ErrorBanner>
					</UI.ShowIf>
				)}
			</UI.Field>
		</UI.Column>
	);
};

type JournalSyncStatusProps = {
	currentJournalContent: Journal["content"] | undefined;
	newJournalContent: string;
};

function JournalSyncStatus({newJournalContent, currentJournalContent}: JournalSyncStatusProps) {
	function getStrategy() {
		if (!newJournalContent && !currentJournalContent) return "no_journal";
		if (newJournalContent !== currentJournalContent) return "unsaved_changes";
		return "synced";
	}

	const strategyToText = {
		no_journal: "No journal",
		unsaved_changes: "Unsaved changes",
		synced: "Synced",
	};

	const strategy = getStrategy();

	return (
		<UI.Text variant="dimmed" ml="auto" style={{fontSize: "12px"}}>
			{strategyToText[strategy] || null}
		</UI.Text>
	);
}
