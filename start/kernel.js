const Server = use("Server");

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on each http request only when the routes
| match.
|
*/
const globalMiddleware = [
	"Adonis/Middleware/BodyParser",
	"App/Middleware/ConvertEmptyStringsToNull",
	"Adonis/Acl/Init",
	"Adonis/Middleware/Session",
	"App/Middleware/SecurityHeaders",
];

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware is key/value object to conditionally add middleware on
| specific routes or group of routes.
|
| // define
| {
|   auth: 'Adonis/Middleware/Auth'
| }
|
| // use
| Route.get().middleware('auth')
|
*/
const namedMiddleware = {
	auth: "Adonis/Middleware/Auth",
	guest: "Adonis/Middleware/AllowGuestOnly",
	is: "Adonis/Acl/Is",
	can: "Adonis/Acl/Can",
	"password-auth": "App/Middleware/PasswordAuth",
	"account-status": "App/Middleware/AccountStatus",
	"reject-inactive-account": "App/Middleware/RejectInactiveAccount",
	"match-auth-user-id": "App/Middleware/MatchAuthUserId",
	"params-resource-exists": "App/Middleware/ParamsResourceExists",
	"check-habit-ids": "App/Middleware/CheckHabitIds",
	"validate-indexes-order": "App/Middleware/ValidateIndexesOrder",
	"require-timezone-header": "App/Middleware/RequireTimezoneHeader",
};

/*
|--------------------------------------------------------------------------
| Server Middleware
|--------------------------------------------------------------------------
|
| Server level middleware are executed even when route for a given URL is
| not registered. Features like `static assets` and `cors` needs better
| control over request lifecycle.
|
*/
const serverMiddleware = [
	// 'Adonis/Middleware/Static',
	"Adonis/Middleware/Cors",
];

Server.registerGlobal(globalMiddleware)
	.registerNamed(namedMiddleware)
	.use(serverMiddleware);
