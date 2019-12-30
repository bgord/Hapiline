import {AxiosResponse} from "axios";
import * as Async from "react-async";

import {ApiError, ApiErrorInterface, ArgError} from "../services/api";

type getArgErrorMessageType = (path: string) => ArgError["message"] | undefined;

interface BasicResponseError {
	responseStatus: AxiosResponse["status"];
	errorCode: ApiErrorInterface["code"];
	errorMessage: ApiErrorInterface["message"];
	argErrors: ApiErrorInterface["argErrors"];
}

interface ResponseError extends Partial<BasicResponseError> {
	getArgErrorMessage: getArgErrorMessageType;
}

export function extractRequestErrors(_error: Error | undefined): Partial<BasicResponseError> {
	const error = _error as ApiError | undefined;

	const responseStatus = error?.response?.status;
	const errorCode = error?.response?.data?.code;
	const errorMessage = error?.response?.data?.message;
	const argErrors = error?.response?.data?.argErrors;

	return {
		responseStatus,
		errorCode,
		errorMessage,
		argErrors,
	};
}

export function getRequestErrors<T>(state: Async.AsyncState<T>): ResponseError {
	const basicResponseError = extractRequestErrors(state.error);

	const getArgErrorMessage: getArgErrorMessageType = field =>
		basicResponseError.argErrors?.find(argError => argError.field === field)?.message;

	return {
		...basicResponseError,
		getArgErrorMessage,
	};
}
