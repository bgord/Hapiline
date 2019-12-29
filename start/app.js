/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers are building blocks for your Adonis app. Anytime you install
| a new Adonis specific package, chances are you will register the
| provider here.
|
*/
const providers = [
	"@adonisjs/framework/providers/AppProvider",
	"@adonisjs/auth/providers/AuthProvider",
	"@adonisjs/bodyparser/providers/BodyParserProvider",
	"@adonisjs/cors/providers/CorsProvider",
	"@adonisjs/lucid/providers/LucidProvider",
	"adonis-acl/providers/AclProvider",
	"@adonisjs/session/providers/SessionProvider",
	"@adonisjs/persona/providers/PersonaProvider",
	"@adonisjs/validator/providers/ValidatorProvider",
	"@adonisjs/mail/providers/MailProvider",
	"@adonisjs/framework/providers/ViewProvider",
	"@adonisjs/drive/providers/DriveProvider",
	"@adonisjs/http-logger/providers/LoggerProvider",
];

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers are required only when running ace commands. For example
| Providers for migrations, tests etc.
|
*/
const aceProviders = [
	"@adonisjs/lucid/providers/MigrationsProvider",
	"adonis-acl/providers/CommandsProvider",
	"@adonisjs/vow/providers/VowProvider",
];

/*
|--------------------------------------------------------------------------
| Aliases
|--------------------------------------------------------------------------
|
| Aliases are short unique names for IoC container bindings. You are free
| to create your own aliases.
|
| For example:
|   { Route: 'Adonis/Src/Route' }
|
*/
const aliases = {
	// models
	User: "App/Models/User",
	Token: "App/Models/Token",
	Role: "Adonis/Acl/Role",
	Permission: "Adonis/Acl/Permission",
	Habit: "App/Models/Habit",

	// constants
	ROLE_NAMES: "App/Constants/ROLE_NAMES",
	ACCOUNT_STATUSES: "App/Constants/ACCOUNT_STATUSES",
	VALIDATION_MESSAGES: "App/Constants/VALIDATION_MESSAGES",
	VALIDATION_RULES: "App/Constants/VALIDATION_RULES",
	SANITIZATION_RULES: "App/Constants/SANITIZATION_RULES",
	EXCEPTION_MESSAGES: "App/Constants/EXCEPTION_MESSAGES",
	MAIL_TEMPLATES: "App/Constants/MAIL_TEMPLATES",
	MAIN_ERROR_CODES: "App/Constants/MAIN_ERROR_CODES",
	MAIN_ERROR_MESSAGES: "App/Constants/MAIN_ERROR_MESSAGES",
	HABIT_SCORE_TYPES: "App/Constants/HABIT_SCORE_TYPES",
	HABIT_STRENGTH_TYPES: "App/Constants/HABIT_STRENGTH_TYPES",
	HABIT_VOTE_TYPES: "App/Constants/HABIT_VOTE_TYPES",

	// validators
	BaseHttpValidator: "App/Validators/BaseHttpValidator",
	StoreSessionValidator: "App/Validators/StoreSession",
	StoreRegistrationIntention: "App/Validators/StoreRegistrationIntention",
	UpdateRegistrationIntention: "App/Validators/UpdateRegistrationIntention",
	UpdateForgotPasswordIntention: "App/Validators/UpdateForgotPasswordIntention",
	StoreForgotPasswordIntention: "App/Validators/StoreForgotPasswordIntention",

	// common
	Utils: "App/Utils/index",
};

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| Here you store ace commands for your package
|
*/
const commands = [];

module.exports = {providers, aceProviders, aliases, commands};
