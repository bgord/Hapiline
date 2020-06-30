import React from "react";
import {useQuery, useMutation} from "react-query";
import * as UI from "./ui";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";
import {api} from "./services/api";
import {Journal, DraftJournal} from "./models";
import {Prompt} from "react-router-dom";

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
		},
	});
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
		<UI.Row p="24">
			<Prompt
				when={shouldTriggerNotSavedChangesPrompt()}
				message="Are you sure? You will lose the changes to your journal."
			/>

			<UI.Field width="100%">
				<UI.Label htmlFor="journal">Journal</UI.Label>
				<UI.Textarea
					style={{minHeight: "400px"}} //TODO: Adjust to new solution
					id="journal"
					onChange={e => setJournalContent(e.target.value)}
					value={journalContent}
				/>
				<UI.Button mt="24" onClick={handleSaveRequest} variant="primary">
					Save
				</UI.Button>

				<UI.ShowIf request={saveJournalRequestState} is="error">
					<UI.ErrorBanner m="24">Couldn't save daily journal, please try again.</UI.ErrorBanner>
				</UI.ShowIf>
			</UI.Field>
		</UI.Row>
	);
};
