const path = require('path');
const SizePlugin = require('size-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
	devtool: 'source-map',
	stats: 'errors-only',
	entry: {
		assistant      : './src/assistant/script',
		browser_action : './src/browser-action/script',

		// Content Scripts
		cs_all       : './src/content-scripts/all',
		cs_amazon    : './src/content-scripts/amazon',
		cs_google    : './src/content-scripts/google',
		cs_wikipedia : './src/content-scripts/wikipedia',
		cs_youtube   : './src/content-scripts/youtube',

		// Background Script
		background   : './src/background-script'
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js'
	},
	plugins: [
		new Dotenv(),
		new SizePlugin(),
		new CopyWebpackPlugin([
			{
				from: '**/*',
				context: 'src',
				ignore: ['*.js']
			},
			{
				from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js'
			}
		])
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: false,
					compress: false,
					output: {
						beautify: true,
						indent_level: 2 // eslint-disable-line camelcase
					}
				}
			})
		]
	}
};
