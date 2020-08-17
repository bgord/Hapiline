import React from "react";
import {QueryResult, MutationResult} from "react-query";

import * as UI from "../ui";

type RequestState = "idle" | "loading" | "error" | "success";

type ShowIfProps = {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	request: QueryResult<any> | MutationResult<any>;
	is: RequestState[] | RequestState;
};

export function ShowIf({request, is, children}: UI.WithChildren<ShowIfProps>) {
	if (Array.isArray(is)) {
		const shouldShowChildren = is.includes(request.status);

		return <>{shouldShowChildren && children}</>;
	}

	const shouldShowChildren = is === request.status;

	return <>{shouldShowChildren && children}</>;
}
