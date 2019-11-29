const path = require("path");
const Dotenv = require("dotenv-webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CheckerPlugin} = require("awesome-typescript-loader");

module.exports = (env, argv) => {
	const dev = argv.mode !== "production";

	return {
		entry: "./frontend/src/index.tsx",
		watch: dev,
		resolve: {
			extensions: [".ts", ".tsx", ".js"],
		},
		output: {
			path: path.join(__dirname, "/public"),
			filename: "bundle.min.js",
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: "awesome-typescript-loader",
					options: {
						useCache: true,
					},
				},
				{
					test: /\.css$/i,
					use: ["style-loader", "css-loader"],
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: "./frontend/index.html",
			}),
			new CheckerPlugin(),
			new Dotenv({path: ".env-frontend"}),
		],
		devtool: "source-map",
		devServer: {
			host: "0.0.0.0",
			port: 4444,
			historyApiFallback: true,
			contentBase: "./",
		},
	};
};
