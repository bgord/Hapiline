import {AxiosError} from "axios";
import axios from "axios";

declare var process: {
	env: {
		API_URL: string;
	};
};

export const api = axios.create({
	baseURL: process.env.API_URL,
});

export interface ArgError {
	field: string;
	validation: string;
	message: string;
}

export interface ApiErrorInterface {
	code: string;
	message: string;
	argErrors: ArgError[];
}

export type ApiError = AxiosError<ApiErrorInterface>;
