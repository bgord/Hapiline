const path = require("path");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CheckerPlugin} = require("awesome-typescript-loader");

module.exports = () => {
	return {
		entry: "./frontend/src/index.tsx",
		watch: true,
		mode: "development",
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
			new webpack.DefinePlugin({
				__BUILD_VERSION__: JSON.stringify(process.env.npm_package_version),
				__BUILD_DATE__: JSON.stringify(new Date().toISOString()),
				__ENVIRONMENT__: JSON.stringify("development"),
			}),

			// Uncomment the plugin below to be able to run service worker
			// in development mode.

			// new workboxPlugin.InjectManifest({
			// 	swSrc: "./frontend/src/sw",
			// 	swDest: "sw.js",
			// 	mode: "development",
			// }),
		],
		devtool: "source-map",
		devServer: {
			host: "0.0.0.0",
			port: 4444,
			historyApiFallback: true,
			contentBase: "./",
		},
		watchOptions: {
			aggregateTimeout: 200,
			poll: 1000,
		},
	};
};
