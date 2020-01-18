import {useHistory} from "react-router-dom";
import qs from "qs";

export const constructQueryParams = (payload: {[index: string]: string}) =>
	qs.stringify(payload, {addQueryPrefix: true});

export const constructUrl = (baseUrl: string, payload: {[index: string]: string}) =>
	baseUrl + constructQueryParams(payload);

const parseQueryParams = (payload: string) => qs.parse(payload, {ignoreQueryPrefix: true});

export function useQueryParam(param: string): [string | undefined, (value: string) => void] {
	const history = useHistory();
	const queryParams: {[index: string]: string} = parseQueryParams(history.location.search);

	return [
		queryParams[param],
		value => history.push(constructQueryParams({...queryParams, [param]: value})),
	];
}

export function useQueryParams(): [
	{[index: string]: string | undefined},
	(baseUrl: string, payload: {[index: string]: string}) => void,
] {
	const history = useHistory();
	const queryParams: {[index: string]: string} = parseQueryParams(history.location.search);

	return [queryParams, (baseUrl, payload) => history.push(baseUrl + constructQueryParams(payload))];
}
