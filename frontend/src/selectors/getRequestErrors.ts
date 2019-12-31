import {AxiosResponse, AxiosError} from "axios";
import * as Async from "react-async";

type ApiError = AxiosError<IApiErrorInterface>;

type getArgErrorMessageType = (path: string) => IArgError["message"] | undefined;

interface IArgError {
	field: string;
	validation: string;
	message: string;
}

interface IApiErrorInterface {
	code: string;
	message: string;
	argErrors: IArgError[];
}

interface IBasicResponseError {
	responseStatus: AxiosResponse["status"];
	errorCode: IApiErrorInterface["code"];
	errorMessage: IApiErrorInterface["message"];
	argErrors: IApiErrorInterface["argErrors"];
}

interface IResponseError extends Partial<IBasicResponseError> {
	getArgErrorMessage: getArgErrorMessageType;
}

export function getRequestErrors(_error: Error | undefined): IResponseError {
	const error = _error as ApiError | undefined;

	const responseStatus = error?.response?.status;
	const errorCode = error?.response?.data?.code;
	const errorMessage = error?.response?.data?.message;
	const argErrors = error?.response?.data?.argErrors;

	const getArgErrorMessage: getArgErrorMessageType = field =>
		argErrors?.find(argError => argError.field === field)?.message;

	return {
		responseStatus,
		errorCode,
		errorMessage,
		argErrors,
		getArgErrorMessage,
	};
}

export function getRequestStateErrors<T>(state: Async.AsyncState<T>): IResponseError {
	return getRequestErrors(state.error);
}
