import {useHistory} from "react-router-dom";
import qs from "qs";

type QueryParamsObject = {[index: string]: string | undefined};

export const constructQueryParams = (payload: QueryParamsObject) =>
	qs.stringify(payload, {addQueryPrefix: true});

export const constructUrl = (baseUrl: string, payload: QueryParamsObject) =>
	baseUrl + constructQueryParams(payload);

const parseQueryParams = (payload: string) => qs.parse(payload, {ignoreQueryPrefix: true});

export function useQueryParam(param: string): [string | undefined, (value: string) => void] {
	const history = useHistory();
	const queryParams: QueryParamsObject = parseQueryParams(history.location.search);

	return [
		queryParams[param],
		value => history.push(constructQueryParams({...queryParams, [param]: value})),
	];
}

export function useQueryParams(
	from?: string,
): [
	{[index: string]: string | undefined},
	(baseUrl: string, payload: QueryParamsObject) => void,
	(url: string) => void,
] {
	const history = useHistory();
	const queryParams: QueryParamsObject = parseQueryParams(history.location.search);

	return [
		queryParams,
		(baseUrl, payload) =>
			history.push({
				pathname: baseUrl,
				search: constructQueryParams(payload),
				state: {
					from: from || baseUrl,
				},
			}),
		(url: string) => history.push(url),
	];
}
