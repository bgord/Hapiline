/* eslint-disable no-console */

import fs from "fs";

import manifest from "../public/manifest.json";

async function main() {
	const currentAppVersion = process.env.npm_package_version;

	if (
		!currentAppVersion ||
		typeof currentAppVersion !== "string" ||
		currentAppVersion.length === 0
	) {
		console.log("Cannot establish current app version, quitting...");
		process.exit(1);
	}

	console.log(`App version: ${currentAppVersion}`);
	console.log(`Manifest version: ${manifest.version}`);

	if (currentAppVersion === manifest.version) {
		console.log("\nManifest file is up to date, nothing to do.");
		process.exit(0);
	}

	console.log("\nGenerating new manifest...");

	const newManifest = constructManifest(currentAppVersion);
	await fs.promises.writeFile("public/manifest.json", JSON.stringify(newManifest));

	console.log("Manifest regenerated!");
}

function constructManifest(version: string) {
	return {
		manifest_version: 2,
		name: "Hapiline",
		short_name: "Hapiline - habit tracker",
		start_url: "https://bgord.tech/login",
		display: "standalone",
		theme_color: "#1654ff",
		background_color: "#ecedf1",
		orientation: "portrait-primary",
		icons: [
			{
				src: "/app-icon.png",
				sizes: "144x144",
			},
		],
		version,
	};
}

main().catch(error => {
	console.error(error);
	process.exit(1);
});
