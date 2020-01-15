import {useLocation} from "react-router-dom";
import qs from "qs";

export function useQueryParam(param: string): [string | undefined] {
	const {search} = useLocation();
	const result = qs.parse(search, {ignoreQueryPrefix: true});
	return [result[param]];
}
