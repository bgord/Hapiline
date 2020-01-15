import {useHistory} from "react-router-dom";
import qs from "qs";

export function useQueryParam(param: string): [string | undefined, (queryParam: string) => void] {
	const history = useHistory();
	const queryParams = qs.parse(history.location.search, {ignoreQueryPrefix: true});

	function updateQueryParam(value: string) {
		const newQueryParams = qs.stringify({...queryParams, [param]: value}, {addQueryPrefix: true});
		history.push(newQueryParams);
	}

	return [queryParams[param], updateQueryParam];
}
