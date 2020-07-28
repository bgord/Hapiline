import React from "react";

import * as UI from "../";

export function Loader() {
	return (
		<UI.Row>
			<UI.Column crossAxis="center" mx="auto" mt="72">
				<UI.LoaderIcon data-mt="72" />
				<UI.Text mt="6">Loading...</UI.Text>
			</UI.Column>
		</UI.Row>
	);
}
