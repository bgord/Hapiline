import * as Async from "react-async";
import {AxiosResponse} from "axios";

import {ApiError, ApiErrorInterface, ArgError} from "../services/api";

type getArgErrorType = (path: string) => ArgError | undefined;

interface BasicResponseError {
	responseStatus: AxiosResponse["status"];
	errorCode: ApiErrorInterface["code"];
	errorMessage: ApiErrorInterface["message"];
	argErrors: ApiErrorInterface["argErrors"];
}

interface ResponseError extends Partial<BasicResponseError> {
	getArgError: getArgErrorType;
}

export function useRequestErrors<T>(state: Async.AsyncState<T>): ResponseError {
	const error = state.error as ApiError | undefined;

	const responseStatus = error?.response?.status;
	const errorCode = error?.response?.data?.code;
	const errorMessage = error?.response?.data?.message;
	const argErrors = error?.response?.data?.argErrors;

	const getArgError: getArgErrorType = field =>
		argErrors?.find(argError => argError.field === field);

	return {
		responseStatus,
		errorCode,
		errorMessage,
		argErrors,
		getArgError,
	};
}
