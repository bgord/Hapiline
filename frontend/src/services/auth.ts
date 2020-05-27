import * as Async from "react-async";

import {User, NewUserPayload, UserProfile, LoginPayload, Token} from "../interfaces/index";
import {_internal_api} from "./api";

export const loginRequest = (loginPayload: LoginPayload) =>
	_internal_api.post<UserProfile>("/login", loginPayload).then(response => response.data);

export const verifyEmailRequest = async (token: Token) =>
	_internal_api.post("/verify-email", {token: decodeURIComponent(token)});

export const forgotPasswordRequest = (email: User["email"]) =>
	_internal_api.post("/forgot-password", {
		email,
	});

export const logoutRequest = async () => _internal_api.post("/logout");

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

export const registrationRequest = (newUserPayload: NewUserPayload) =>
	_internal_api.post("/register", newUserPayload);

export const isLoggedInRequest: Async.PromiseFn<UserProfile> = () =>
	_internal_api.get("/me").then(response => response.data);

export const deleteAccountRequest: Async.DeferFn<void> = () => _internal_api.delete("/account");

export const changeEmailRequest: Async.DeferFn<void> = ([newEmail, password]: string[]) =>
	_internal_api.post("/change-email", {
		newEmail,
		password,
	});

export const updatePasswordRequst: Async.DeferFn<void> = ([
	old_password,
	password,
	password_confirmation,
]: string[]) =>
	_internal_api.patch("/update-password", {
		old_password,
		password,
		password_confirmation,
	});
