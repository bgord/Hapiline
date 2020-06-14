// TODO create a separate file with overrides for production?

const path = require("path");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const workboxPlugin = require("workbox-webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CheckerPlugin} = require("awesome-typescript-loader");

module.exports = (_env, argv) => {
	const dev = argv.mode !== "production";

	return {
		entry: "./frontend/src/index.tsx",
		watch: dev,
		mode: argv.mode || "development",
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
			new Dotenv({path: dev ? ".env-frontend" : ".env-frontend.prod"}),
			new webpack.DefinePlugin({
				__BUILD_VERSION__: JSON.stringify(process.env.npm_package_version),
				__BUILD_DATE__: JSON.stringify(new Date().toISOString()),
				__ENVIRONMENT__: JSON.stringify(dev ? "development" : "production"),
			}),
			new workboxPlugin.InjectManifest({
				swSrc: "./frontend/src/sw",
				swDest: "sw.js",
			}),
		],
		devtool: dev ? "source-map" : "",
		devServer: {
			host: "0.0.0.0",
			port: 4444,
			historyApiFallback: true,
			contentBase: "./",
		},

		// Allow for 300kb of max asset and an initial bundle
		// that's downloaded by the browser.
		performance: {
			maxAssetSize: dev ? 3000000 : 350000,
			maxEntrypointSize: dev ? 3000000 : 350000,
			hints: "warning",
		},
	};
};
