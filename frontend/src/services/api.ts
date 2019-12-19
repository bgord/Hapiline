import axios, {AxiosError} from "axios";

import {
	addHabitRequest,
	deleteHabitRequest,
	getHabitRequest,
	getHabitsRequest,
	patchHabitRequest,
	reorderHabitsRequest,
} from "./habit";
import {
	forgotPasswordRequest,
	isLoggedInRequest,
	loginRequest,
	logoutRequest,
	newPasswordRequest,
	registrationRequest,
	verifyEmailRequest,
} from "./auth";

declare var process: {
	env: {
		API_URL: string;
	};
};

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

export const _internal_api = axios.create({
	baseURL: process.env.API_URL,
});

export const api = {
	habit: {
		get: getHabitsRequest,
		post: addHabitRequest,
		delete: deleteHabitRequest,
		patch: patchHabitRequest,
		show: getHabitRequest,
		reorder: reorderHabitsRequest,
	},
	auth: {
		login: loginRequest,
		verifyEmail: verifyEmailRequest,
		forgotPassword: forgotPasswordRequest,
		logout: logoutRequest,
		newPassword: newPasswordRequest,
		register: registrationRequest,
		isLoggedIn: isLoggedInRequest,
	},
};
