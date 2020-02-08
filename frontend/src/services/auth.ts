import * as Async from "react-async";

import {UserProfileInterface} from "../interfaces/IUserProfile";
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

export const logoutRequest: Async.PromiseFn<void> = async () => _internal_api.post("/logout");

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

export const deleteAccountRequest: Async.DeferFn<void> = () => _internal_api.delete("/account");

export const changeEmailRequest: Async.DeferFn<void> = ([newEmail, password]: string[]) =>
	_internal_api.post("/change-email", {
		newEmail,
		password,
	});

export const updatePasswordRequst: Async.DeferFn<void> = ([
	old_password,
	new_password,
	new_password_confirmation,
]: string[]) =>
	_internal_api.patch("/update-password", {
		old_password,
		password: new_password,
		password_confirmation: new_password_confirmation,
	});
