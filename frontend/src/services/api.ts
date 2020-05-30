import axios from "axios";

import {
	addHabitDayVoteRequest,
	addHabitRequest,
	deleteHabitRequest,
	getHabitRequest,
	getHabitVoteChartRequest,
	getHabitsRequest,
	patchHabitRequest,
	reorderHabitsRequest,
	updateVoteCommentRequest,
	getHabitVoteCommentsRequest,
} from "./habit";
import {
	forgotPasswordRequest,
	isLoggedInRequest,
	loginRequest,
	logoutRequest,
	newPasswordRequest,
	registrationRequest,
	verifyEmailRequest,
	deleteAccountRequest,
	changeEmailRequest,
	updatePasswordRequst,
} from "./auth";
import {getDayRequest, getMonthRequest} from "./calendar";
import {getDashboardStats, getDashboardStreakStats} from "./stats";
import {getNotificationsRequest, updateNotificationRequest} from "./notifications";

// TODO: centralize definitions for process and __*__ variables
declare const process: {
	env: {
		API_URL: string;
	};
};

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
		addHabitDayVote: addHabitDayVoteRequest,
		getHabitVoteChart: getHabitVoteChartRequest,
		updateVoteComment: updateVoteCommentRequest,
		getHabitVoteComments: getHabitVoteCommentsRequest,
	},
	auth: {
		login: loginRequest,
		verifyEmail: verifyEmailRequest,
		forgotPassword: forgotPasswordRequest,
		logout: logoutRequest,
		newPassword: newPasswordRequest,
		register: registrationRequest,
		isLoggedIn: isLoggedInRequest,
		deleteAccount: deleteAccountRequest,
		changeEmail: changeEmailRequest,
		updatePassword: updatePasswordRequst,
	},
	calendar: {
		getMonth: getMonthRequest,
		getDay: getDayRequest,
	},
	stats: {
		dashboard: getDashboardStats,
		dashboardStreak: getDashboardStreakStats,
	},
	notifications: {
		get: getNotificationsRequest,
		update: updateNotificationRequest,
	},
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type AsyncReturnType<T extends (...args: any) => any> = T extends (
	...args: any
) => Promise<infer U>
	? U
	: T extends (...args: any) => infer U
	? U
	: any;
