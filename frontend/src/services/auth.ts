import * as Async from "react-async";

import {UserProfileInterface} from "../contexts/auth-context";
import {_internal_api} from "./api";

export const loginRequest: Async.DeferFn<UserProfileInterface> = (
	[email, password]: string[],
	{history, setUserProfile},
) =>
	_internal_api
		.post<UserProfileInterface>("/login", {
			email,
			password,
		})
		.then(response => {
			setUserProfile(response.data);
			history.push("/dashboard");
			return response.data;
		});

export const verifyEmailRequest: Async.PromiseFn<void> = async ({token}) =>
	_internal_api.post("/verify-email", {token: decodeURIComponent(token)});

export const forgotPasswordRequest: Async.DeferFn<void> = ([email]: string[]) =>
	_internal_api.post("/forgot-password", {
		email,
	});

export const logoutRequest: Async.PromiseFn<void> = async ({
	history,
	setUserProfile,
}) => {
	await _internal_api.post("/logout");
	setUserProfile(null);
	history.push("/");
};

export const newPasswordRequest: Async.DeferFn<void> = async ([
	token,
	password,
	passwordConfirmation,
]: string[]) =>
	_internal_api.post("/new-password", {
		token: decodeURIComponent(token),
		password,
		password_confirmation: passwordConfirmation,
	});

export const registrationRequest: Async.DeferFn<void> = ([
	email,
	password,
	passwordConfirmation,
]: string[]) =>
	_internal_api.post("/register", {
		email,
		password,
		password_confirmation: passwordConfirmation,
	});

export const isLoggedInRequest: Async.PromiseFn<UserProfileInterface> = () =>
	_internal_api.get("/me").then(response => response.data);
