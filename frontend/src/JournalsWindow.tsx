import React from "react";
import {useQuery} from "react-query";

import {Journal} from "./models";
import {api} from "./services/api";
import {formatDay, formatDayName} from "./services/date-formatter";
import {pluralize} from "./services/pluralize";
import {useErrorToast} from "./contexts/toasts-context";
import * as UI from "./ui/";
import {useQueryParams} from "./hooks/useQueryParam";

export function JournalsWindow() {
	const triggerErrorToast = useErrorToast();

	const getJournalsRequestState = useQuery<Journal[], "journals">({
		queryKey: "journals",
		queryFn: api.journal.get,
		config: {
			onError: () => triggerErrorToast("Couldn't fetch dashboard stats."),
			retry: false,
		},
	});

	const journals = getJournalsRequestState.data ?? [];

	return (
		<UI.Card
			as="main"
			tabIndex={0}
			pt="12"
			mx={["auto", "6"]}
			mt={["48", "12"]}
			mb="24"
			width={["view-l", "auto"]}
		>
			<UI.Row bg="gray-1" p={["24", "12"]}>
				<UI.Header variant={["large", "small"]}>Journals</UI.Header>
			</UI.Row>

			<UI.Column p="24" px={["24", "6"]}>
				<UI.ShowIf request={getJournalsRequestState} is="loading">
					<UI.Text>Loading...</UI.Text>
				</UI.ShowIf>

				<UI.ShowIf request={getJournalsRequestState} is="error">
					<UI.ErrorBanner>Cannot fetch journals, please try again</UI.ErrorBanner>
				</UI.ShowIf>

				<UI.ShowIf request={getJournalsRequestState} is="success">
					<UI.Text ml="auto" mb={["24", "12"]}>
						<UI.Text variant="bold">{journals.length}</UI.Text>{" "}
						{pluralize("result", journals.length)}
					</UI.Text>

					{journals.length === 0 && getJournalsRequestState.status === "success" && (
						<UI.InfoBanner>
							<UI.Text>You don't have any journals</UI.Text>
						</UI.InfoBanner>
					)}

					<UI.ExpandContractList max={20}>
						{journals.map(journal => (
							<JournalItem key={journal.id} {...journal} />
						))}
					</UI.ExpandContractList>
				</UI.ShowIf>
			</UI.Column>
		</UI.Card>
	);
}

// TODO: redirect to an already chosen journal tab
function JournalItem(journal: Journal) {
	const [, updateQueryParams] = useQueryParams();

	function showJournal() {
		updateQueryParams("calendar", {preview_day: formatDay(journal.day)});
	}

	const numberOfWords = getNumberOfWords(journal.content);

	return (
		<UI.Row key={journal.id} crossAxis="baseline" by="gray-1" py="12">
			<UI.Row wrap={[, "wrap"]} mainAxis="between">
				<UI.Wrapper mr="24">
					<UI.Text variant="semi-bold" mr="12">
						{formatDay(journal.day)}
					</UI.Text>

					<UI.Text>{formatDayName(journal.day)}</UI.Text>
				</UI.Wrapper>

				<UI.Text variant="bold" mr="24">
					{numberOfWords} {pluralize("word", numberOfWords)}
				</UI.Text>
			</UI.Row>

			<UI.Button variant="outlined" onClick={showJournal}>
				Show
			</UI.Button>
		</UI.Row>
	);
}

function getNumberOfWords(content: Journal["content"]): number {
	if (!content) return 0;
	return content.split(" ").length;
}
