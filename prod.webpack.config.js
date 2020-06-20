const path = require("path");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const workboxPlugin = require("workbox-webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CheckerPlugin} = require("awesome-typescript-loader");

module.exports = () => {
	return {
		entry: "./frontend/src/index.tsx",
		watch: false,
		mode: "production",
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
			new Dotenv({path: ".env-frontend.prod"}),
			new webpack.DefinePlugin({
				__BUILD_VERSION__: JSON.stringify(process.env.npm_package_version),
				__BUILD_DATE__: JSON.stringify(new Date().toISOString()),
				__ENVIRONMENT__: JSON.stringify("production"),
			}),
			new workboxPlugin.InjectManifest({
				swSrc: "./frontend/src/sw",
				swDest: "sw.js",
				mode: "production",
			}),
		],
		// Allow for 300kb of max asset and an initial bundle
		// that's downloaded by the browser.
		performance: {
			maxAssetSize: 350000,
			maxEntrypointSize: 350000,
			hints: "warning",
		},
	};
};
