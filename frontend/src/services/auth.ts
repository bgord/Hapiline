import {
	User,
	NewUserPayload,
	UserProfile,
	LoginPayload,
	Token,
	NewPasswordPayload,
	NewEmailPayload,
	UpdatePasswordPayload,
} from "../models";
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

export const updatePasswordRequst = (updatePasswordPayload: UpdatePasswordPayload) =>
	_internal_api.patch("/update-password", updatePasswordPayload);
