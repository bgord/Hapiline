import * as Async from "react-async";

import {
	User,
	NewUserPayload,
	UserProfile,
	LoginPayload,
	Token,
	NewPasswordPayload,
	NewEmailPayload,
} from "../interfaces/index";
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

export const newPasswordRequest = async (newPasswordPayload: NewPasswordPayload) =>
	_internal_api.post("/new-password", newPasswordPayload);

export const registrationRequest = (newUserPayload: NewUserPayload) =>
	_internal_api.post("/register", newUserPayload);

export const isLoggedInRequest = (_key: "is_logged_in") =>
	_internal_api.get<UserProfile>("/me").then(response => response.data);

export const deleteAccountRequest = async () => _internal_api.delete("/account");

export const changeEmailRequest = (newEmailPayload: NewEmailPayload) =>
	_internal_api.post("/change-email", newEmailPayload);

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
