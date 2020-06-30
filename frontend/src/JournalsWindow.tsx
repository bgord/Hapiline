import React from "react";
import {useQuery} from "react-query";

import {Journal} from "./models";
import {api} from "./services/api";
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
			</UI.Column>
		</UI.Card>
	);
}
