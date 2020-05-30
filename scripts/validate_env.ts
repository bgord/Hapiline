import dotenv from "dotenv";
import fs from "fs";

const envFrontendExampleFilename = ".env-frontend.example";
const envFrontendProductionFilename = ".env-frontend.prod";

async function main() {
	console.log("⌛ Validating server and frontend env variables");

	const envFrontendExampleString = await fs.promises.readFile(envFrontendExampleFilename, {
		encoding: "utf8",
	});
	const envFrontendExample = dotenv.parse(envFrontendExampleString);
	console.log(`\n✓ Loaded and parsed the example frontend env file: ${envFrontendExampleFilename}`);

	const envFrontendProductionString = await fs.promises.readFile(envFrontendProductionFilename, {
		encoding: "utf8",
	});
	const envFrontendProduction = dotenv.parse(envFrontendProductionString);
	console.log(
		`✓ Loaded and parsed the production frontend env file: ${envFrontendProductionFilename}`,
	);
}

main();
