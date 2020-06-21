import React, {useState, useEffect} from "react";
import {useQuery, useMutation} from "react-query";
import * as UI from "./ui";
import {useErrorToast, useSuccessToast} from "./contexts/toasts-context";
import {api} from "./services/api";
import {Journal, NewJournalRequest} from "./models";

interface JournalProps {
	day: Date;
}
export const JournalTab: React.FC<JournalProps> = ({day}) => {
	const [journalText, setJournalText] = useState("");
	const triggerErrorToast = useErrorToast();
	const triggerSuccessToast = useSuccessToast();

	const journalRequest = useQuery<Journal, ["journal", Journal["day"]]>({
		queryKey: ["journal", day],
		queryFn: api.journal.get,
		config: {
			retry: false,
		},
	});
	const [saveJournal, saveJournalRequest] = useMutation<Journal, NewJournalRequest>(
		api.journal.post,
		{
			onSuccess: () => {
				journalRequest.refetch();
				triggerSuccessToast("Daily journal successfully updated!");
			},
			onError: () => triggerErrorToast("Error while updating daily jorunal"),
		},
	);

	const handleSaveRequest = () => {
		saveJournal({
			day,
			content: journalText,
		});
	};
	const journal = journalRequest?.data;

	useEffect(() => {
		setJournalText(journal?.content ?? "");
	}, [journal]);

	return (
		<UI.Row p="24">
			<UI.ShowIf request={saveJournalRequest} is="error">
				<UI.ErrorBanner m="24">Couldn't save daily journal, please try again.</UI.ErrorBanner>
			</UI.ShowIf>

			<UI.Field width="100%">
				<UI.Label htmlFor="journal">Journal</UI.Label>
				<UI.Textarea
					style={{minHeight: "400px", fontSize: "1.1rem"}} //TODO: Adjust to new solution
					id="journal"
					onChange={e => setJournalText(e.target.value)}
					value={journalText}
				/>
				<UI.Button onClick={handleSaveRequest} variant="primary">
					Save
				</UI.Button>
			</UI.Field>
		</UI.Row>
	);
};
