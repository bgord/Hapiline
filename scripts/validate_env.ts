/* eslint-disable no-console */

import dotenv from "dotenv";
import fs from "fs";
import * as yup from "yup";

const MODE = process.argv[2] === "--with-prod" ? "production" : "development";

if (MODE === "development") console.log(`Validating only development env files.`);
if (MODE === "production") console.log(`Validating both development and production env files.`);

const envFrontendDevelopmentFilename = ".env-frontend";
const envFrontendProductionFilename = ".env-frontend.prod";

const envServerDevelopmentFilename = ".env";
const envServerProductionFilename = ".env-prod";

const PORT = yup
	.number()
	.positive()
	.integer()
	.required();

async function main() {
	// =========== frontend development =========== //
	const envFrontendDevelopmentString = await fs.promises.readFile(envFrontendDevelopmentFilename, {
		encoding: "utf8",
	});
	const envFrontendDevelopment = dotenv.parse(envFrontendDevelopmentString);
	console.log(
		`\n✓  Loaded and parsed the development frontend env file: ${envFrontendDevelopmentFilename}`,
	);
	console.log("⌛ Checking frontend development env variables");
	await validateEnvFrontendDevelopment(envFrontendDevelopment);
	console.log(`👍 Frontend development env file seems correct!`);

	// =========== frontend production =========== //
	if (MODE === "production") {
		const envFrontendProductionString = await fs.promises.readFile(envFrontendProductionFilename, {
			encoding: "utf8",
		});
		const envFrontendProduction = dotenv.parse(envFrontendProductionString);
		console.log(
			`\n✓  Loaded and parsed the production frontend env file: ${envFrontendProductionFilename}`,
		);
		console.log("⌛ Checking frontend production env variables");
		await validateEnvFrontendProduction(envFrontendProduction, envFrontendDevelopment);
		console.log(`👍 Frontend production env file seems correct!`);
	}

	// =========== server development =========== //
	const envServerDevelopmentString = await fs.promises.readFile(envServerDevelopmentFilename, {
		encoding: "utf8",
	});
	const envServerDevelopment = dotenv.parse(envServerDevelopmentString);
	console.log(
		`\n✓  Loaded and parsed the development server env file: ${envServerDevelopmentFilename}`,
	);
	console.log("⌛ Checking server development env variables");
	await validateEnvServerDevelopment(envServerDevelopment);
	console.log(`👍 Server development env file seems correct!`);

	// =========== server production =========== //
	if (MODE === "production") {
		const envServerProductionString = await fs.promises.readFile(envServerProductionFilename, {
			encoding: "utf8",
		});
		const envServerProduction = dotenv.parse(envServerProductionString);
		console.log(
			`\n✓  Loaded and parsed the production server env file: ${envServerProductionFilename}`,
		);
		console.log("⌛ Checking server production env variables");
		await validateEnvServerProduction(envServerProduction, envServerDevelopment);
		console.log(`👍 Server production env file seems correct!`);
	}
}

main();

async function validateEnvFrontendDevelopment(envFrontendDevelopment: dotenv.DotenvParseOutput) {
	try {
		const envFrontendDevelopmentSchema = yup
			.object()
			.shape({
				API_URL: yup.string().equals(["http://hapiline.localhost/api/v1/"]),
				BUGSNAG_API_KEY: yup
					.string()
					.length(32)
					.required(),
			})
			.noUnknown();
		await envFrontendDevelopmentSchema.validate(envFrontendDevelopment, {strict: true});
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

async function validateEnvFrontendProduction(
	envFrontendProduction: dotenv.DotenvParseOutput,
	envFrontendDevelopment: dotenv.DotenvParseOutput,
) {
	try {
		const envFrontendProductionSchema = yup
			.object()
			.shape({
				API_URL: yup
					.string()
					.url()
					.notOneOf(
						[envFrontendDevelopment.API_URL],
						"'API_URL' for development and production must be different",
					)
					.required(),
				BUGSNAG_API_KEY: yup
					.string()
					.length(32)
					.equals(
						[envFrontendDevelopment.BUGSNAG_API_KEY],
						"Production and development BUGSNAG_API_KEY values must be the same",
					)
					.required(),
			})
			.noUnknown();
		await envFrontendProductionSchema.validate(envFrontendProduction, {strict: true});
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

async function validateEnvServerDevelopment(envServerDevelopment: dotenv.DotenvParseOutput) {
	try {
		const envServerDevelopmentSchema = yup
			.object()
			.shape({
				HOST: yup
					.string()
					.equals(["0.0.0.0"])
					.required(),
				PORT,
				NODE_ENV: yup
					.string()
					.equals(["development"])
					.required(),
				APP_URL: yup.string().required(),
				APP_KEY: yup
					.string()
					.length(32)
					.required(
						"APP_KEY is required to encrypt and sign cookies\n Run `./run.sh adonis key:generate`.",
					),
				DB_HOST: yup.string().required(),
				DB_PORT: PORT,
				DB_USER: yup.string().required(),
				DB_PASSWORD: yup.string().required(),
				DB_DATABASE: yup.string().required(),
				SMTP_HOST: yup.string().required(),
				SMTP_PORT: PORT,
				MAIL_USERNAME: yup.string().required(),
				MAIL_PASSWORD: yup.string().required(),
				MAIL_FROM: yup
					.string()
					.email()
					.required(),
				HOST_PATH: yup.string().equals(["http://hapiline.localhost"]),
			})
			.noUnknown();
		await envServerDevelopmentSchema.validate(envServerDevelopment);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

async function validateEnvServerProduction(
	envServerProduction: dotenv.DotenvParseOutput,
	envServerDevelopment: dotenv.DotenvParseOutput,
) {
	try {
		const envServerProductionSchema = yup
			.object()
			.shape({
				HOST: yup
					.string()
					.equals(["0.0.0.0"])
					.required(),
				PORT,
				NODE_ENV: yup
					.string()
					.equals(["production"])
					.required(),
				APP_URL: yup.string().required(),
				APP_KEY: yup
					.string()
					.length(32)
					.required(
						"APP_KEY is required to encrypt and sign cookies\n Run `./run.sh adonis key:generate`.",
					),
				DB_HOST: yup.string().required(),
				DB_PORT: PORT,
				DB_USER: yup.string().required(),
				DB_PASSWORD: yup
					.string()
					.notOneOf(
						[envServerDevelopment.DB_PASSWORD],
						`'DB_PASSWORD' for development and production must be different`,
					)
					.required(),
				DB_DATABASE: yup.string().required(),
				SMTP_HOST: yup.string().required(),
				SMTP_PORT: PORT,
				MAIL_USERNAME: yup.string().required(),
				MAIL_PASSWORD: yup.string().required(),
				MAIL_FROM: yup
					.string()
					.email()
					.required(),
				HOST_PATH: yup
					.string()
					.notOneOf(
						[envServerDevelopment.HOST_PATH],
						`'HOST_PATH' for development and production must be different`,
					)
					.required(),
			})
			.noUnknown();
		await envServerProductionSchema.validate(envServerProduction);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}
