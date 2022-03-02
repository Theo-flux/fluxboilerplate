/* eslint-disable no-unused-vars */
const path = require('path');
const webpack = require('webpack');

// Plugins
const copyWebpackPlugin = require('copy-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const imageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const terserWebpackPlugin = require('terser-webpack-plugin');

const { dir } = require('console');


const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev';
const dirApp = path.join(__dirname, 'app');
const dirImages = path.join(__dirname, 'images');
const dirShared = path.join(__dirname, 'shared');
const dirStyles = path.join(__dirname, 'styles');
const dirVideos = path.join(__dirname, 'videos');
const dirNode = 'node_modules';

console.log(dirApp, dirShared, dirStyles);

module.exports = {
	entry: [
		path.join(dirApp, 'index.js'),
		path.join(dirStyles, 'index.scss')
	],
	resolve: {
		modules: [
			dirApp,
			dirImages,
			dirShared,
			dirStyles,
			dirVideos,
			dirNode
		]
	},

	plugins: [
		new webpack.DefinePlugin({
			IS_DEVELOPMENT
		}),

		new copyWebpackPlugin({
			patterns: [
				{
					from: './shared',
					to:''
				}
			]
		}),

		new miniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css'
		}),

		new imageMinimizerPlugin({
			minimizer: {
				implementation: imageMinimizerPlugin.imageminMinify,
				options: {
					plugins: [
						['gifsicle', { interlaced: true }],
						['jpegtran', { progressive: true }],
						['optipng', { optimizationLevel: 5 }],
					],
				},
			},
		}),
	],

	optimization: {
		minimize: true,
		minimizer: [new terserWebpackPlugin()],
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader:'babel-loader'
				}
			},

			{
				test: /\.(glsl|frag|vert)$/,
				loader: 'raw-loader',
				exclude: /node_modules/
			},

			{
				test: /\.(glsl|frag|vert)$/,
				loader: 'glslify-loader',
				exclude: /node_modules/
			},

			{
				test: /\.scss$/,
				use: [
					{
						loader: miniCssExtractPlugin.loader,
						options: {
							publicPath: ''
						}
					},

					{
						loader: 'css-loader'
					},

					{
						loader:'postcss-loader'
					},

					{
						loader:'sass-loader'
					}
				]
			},

			{
				test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
				loader: 'file-loader',
				options: {
					outputPath: 'images',
					name (file) {
						return '[hash].[ext]';
					}
				}
			},

			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					{
						loader: imageMinimizerPlugin.loader,
						options: {
							minimizer: {
								implementation: imageMinimizerPlugin.imageminMinify,
								options: {
									plugins: [
										'imagemin-gifsicle',
										'imagemin-mozjpeg',
										'imagemin-pngquant',
										'imagemin-svgo',
									],
								},
							},
						},
					},
				],
			},
		]
	}
};
