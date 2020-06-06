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
	console.log("\n⌛ Checking frontend env variables");

	const envFrontendDevelopmentString = await fs.promises.readFile(envFrontendDevelopmentFilename, {
		encoding: "utf8",
	});
	const envFrontendDevelopment = dotenv.parse(envFrontendDevelopmentString);
	console.log(
		`\n✓ Loaded and parsed the development frontend env file: ${envFrontendDevelopmentFilename}`,
	);
	try {
		const envFrontendDevelopmentSchema = yup
			.object()
			.shape({
				API_URL: yup.string().required(),
				BUGSNAG_API_KEY: yup
					.string()
					.length(32)
					.required(),
			})
			.noUnknown();
		await envFrontendDevelopmentSchema.validate(envFrontendDevelopment, {strict: true});
		console.log(`👍 Frontend development env file seems correct!`);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}

	const envFrontendProductionString = await fs.promises.readFile(envFrontendProductionFilename, {
		encoding: "utf8",
	});
	const envFrontendProduction = dotenv.parse(envFrontendProductionString);
	console.log(
		`\n✓ Loaded and parsed the production frontend env file: ${envFrontendProductionFilename}`,
	);
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
		console.log(`👍 Frontend production env file seems correct!`);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}

	console.log("\n⌛ Checking server env variables");

	const envServerDevelopmentString = await fs.promises.readFile(envServerDevelopmentFilename, {
		encoding: "utf8",
	});
	const envServerDevelopment = dotenv.parse(envServerDevelopmentString);
	console.log(
		`\n✓ Loaded and parsed the development server env file: ${envServerDevelopmentFilename}`,
	);

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
				APP_NAME: yup.string().required(),
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
				HOST_PATH: yup.string().required(),
			})
			.noUnknown();
		await envServerDevelopmentSchema.validate(envServerDevelopment);
		console.log(`👍 Server production env file seems correct!`);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}

	const envServerProductionString = await fs.promises.readFile(envServerProductionFilename, {
		encoding: "utf8",
	});
	const envServerProduction = dotenv.parse(envServerProductionString);
	console.log(
		`\n✓ Loaded and parsed the production server env file: ${envServerProductionFilename}`,
	);

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
				APP_NAME: yup.string().required(),
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
		console.log(`👍 Server production env file seems correct!`);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

main();
