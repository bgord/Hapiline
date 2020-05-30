import dotenv from "dotenv";
import fs from "fs";
import * as yup from "yup";

const envFrontendDevFilename = ".env-frontend";
const envFrontendProductionFilename = ".env-frontend.prod";

async function main() {
	console.log("⌛ Checking frontend env variables");

	const envFrontendDevelopmentString = await fs.promises.readFile(envFrontendDevFilename, {
		encoding: "utf8",
	});
	const envFrontendDevelopment = dotenv.parse(envFrontendDevelopmentString);
	console.log(`\n✓ Loaded and parsed the development frontend env file: ${envFrontendDevFilename}`);
	try {
		const envFrontendDevelopmentSchema = yup
			.object()
			.shape({
				NODE_ENV: yup
					.string()
					.equals(["development"])
					.required(),
				API_URL: yup
					.string()
					.url()
					.required(),
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
				NODE_ENV: yup
					.string()
					.equals(["production"])
					.required(),
				API_URL: yup
					.string()
					.url()
					.notOneOf(
						[envFrontendDevelopment.API_URL],
						"Production API_URL cannot be the same as development API_URL",
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
}

main();
