import React from "react";
import {useQuery} from "react-query";

import {Journal} from "./models";
import {api} from "./services/api";
import {formatDay, formatDayName} from "./services/date-formatter";
import {pluralize} from "./services/pluralize";
import {useErrorToast} from "./contexts/toasts-context";
import * as UI from "./ui/";

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

	const journalsWithWordCount = journals.map(journal => ({
		wordCount: journal.content ? journal.content.split(" ").length : 0,
		...journal,
	}));

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
					Loading...
				</UI.ShowIf>

				<UI.ShowIf request={getJournalsRequestState} is="error">
					<UI.ErrorBanner>Cannot fetch journals, please try again</UI.ErrorBanner>
				</UI.ShowIf>

				<UI.ShowIf request={getJournalsRequestState} is="success">
					<UI.Text ml="auto" mb="24">
						<UI.Text variant="bold">{journals.length}</UI.Text> results
					</UI.Text>

					<UI.ExpandContractList max={20}>
						{journalsWithWordCount.map(journal => (
							<UI.Row key={journal.id} crossAxis="baseline" by="gray-1" py="12">
								<UI.Text variant="semi-bold" mr="12">
									{formatDay(journal.day)}
								</UI.Text>
								<UI.Text variant="regular">{formatDayName(journal.day)}</UI.Text>

								<UI.Text variant="bold" mr="24" ml="auto">
									{journal.wordCount} {pluralize("word", journal.wordCount)}
								</UI.Text>
								<UI.Button variant="outlined">Show</UI.Button>
							</UI.Row>
						))}
					</UI.ExpandContractList>
				</UI.ShowIf>
			</UI.Column>
		</UI.Card>
	);
}
