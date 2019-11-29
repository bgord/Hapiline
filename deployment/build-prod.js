/* eslint-disable no-console */

const fs = require("fs-extra");
const chalk = require("chalk");
const shell = require("shelljs");

const deployCacheDir = "./deployment/deploy-cache";
const currentVersion = Date.now();

const outputFileName = `hapiline-${currentVersion}.tar`;
const outputFilePath = `${deployCacheDir}/${outputFileName}`;

newLine();

info("Requested deploy cache directory", deployCacheDir);
info("Current version", currentVersion);
info("Output file path", outputFilePath);

newLine();

async function main() {
	try {
		await fs.ensureDir(deployCacheDir);
		await fs.emptyDir(deployCacheDir);
		console.log("Requested deploy cache directory exists and is empty.");

		newLine();
		console.log("Installing fresh packages...");
		await exec("npm install");

		newLine();
		console.log("Building css...");
		await exec("npm run frontend:css:build:prod");

		newLine();
		console.log("Building frontend...");
		await exec("npm run frontend:build:prod");

		const filesAndDirsToExclude = [
			"node_modules",
			".git",
			".awcache",
			"cypress",
			"test",
			"deployment",
		];

		const excludePattern = filesAndDirsToExclude
			.map(pattern => `--exclude ${pattern}`)
			.join(" ");

		await exec(`tar ${excludePattern} -cf ${outputFilePath} .`);

		newLine();
		console.log(`Build file created: ${outputFilePath}`);
	} catch (e) {
		console.error(e);
		error("Quitting...");
	}
}

main();

function info(key, value) {
	console.log(chalk.black.bgWhite.bold(`${key}:`), value);
}

function newLine() {
	console.log("");
}

function exec(command) {
	return shell.exec(command, {silent: true}).stdout.trim();
}

function error(string) {
	console.log(chalk.white.bgRed(string));
}
