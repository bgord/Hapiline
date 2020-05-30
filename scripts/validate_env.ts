import dotenv from "dotenv";
import fs from "fs";
import * as yup from "yup";

const envFrontendDevFilename = ".env-frontend";
const envFrontendProductionFilename = ".env-frontend.prod";

const envFrontendSchema = yup
	.object()
	.shape({
		NODE_ENV: yup
			.mixed()
			.oneOf(["development", "production"])
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

async function main() {
	console.log("⌛ Checking frontend env variables");

	const envFrontendExampleString = await fs.promises.readFile(envFrontendDevFilename, {
		encoding: "utf8",
	});
	const envFrontendExample = dotenv.parse(envFrontendExampleString);
	console.log(`\n✓ Loaded and parsed the development frontend env file: ${envFrontendDevFilename}`);
	try {
		await envFrontendSchema.validate(envFrontendExample, {strict: true});
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
		await envFrontendSchema.validate(envFrontendProduction, {strict: true});
		console.log(`👍 Frontend production env file seems correct!`);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

main();
