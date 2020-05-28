import React from "react";
import {QueryResult, MutationResult} from "react-query";

type RequestState = "idle" | "loading" | "error" | "success";

type ShowIfProps = {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	request: QueryResult<any> | MutationResult<any>;
	is: RequestState[] | RequestState;
};

export const ShowIf: React.FC<ShowIfProps> = ({request, is, children}) => {
	if (Array.isArray(is)) {
		const shouldShowChildren = is.includes(request.status);

		return <>{shouldShowChildren && children}</>;
	}

	const shouldShowChildren = is === request.status;

	return <>{shouldShowChildren && children}</>;
};
