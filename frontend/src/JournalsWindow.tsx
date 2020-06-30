import React from "react";

import * as UI from "./ui/";

export function JournalsWindow() {
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
				journals
			</UI.Column>
		</UI.Card>
	);
}
