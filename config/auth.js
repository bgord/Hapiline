// Disabling ESLint since this is a generated file.
/* eslint-disable */

const Env = use("Env");

module.exports = {
	/*
  |--------------------------------------------------------------------------
  | Authenticator
  |--------------------------------------------------------------------------
  |
  | Authentication is a combination of serializer and scheme with extra
  | config to define on how to authenticate a user.
  |
  | Available Schemes - basic, session, jwt, api
  | Available Serializers - lucid, database
  |
  */
	authenticator: "session",

	/*
  |--------------------------------------------------------------------------
  | Session
  |--------------------------------------------------------------------------
  |
  | Session authenticator makes use of sessions to authenticate a user.
  | Session authentication is always persistent.
  |
  */
	session: {
		serializer: "lucid",
		model: "User",
		scheme: "session",
		uid: "email",
		password: "password",
	},

	/*
  |--------------------------------------------------------------------------
  | Api
  |--------------------------------------------------------------------------
  |
  | The Api scheme makes use of API personal tokens to authenticate a user.
  |
  */
	api: {
		serializer: "lucid",
		model: "User",
		scheme: "api",
		uid: "email",
		password: "password",
	},
};
