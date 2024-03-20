const path = require('path');

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopywebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	context: __dirname,
	mode: 'production',
	devtool: false,
	entry: './app/src/main.ts',
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist')
	},
	optimization: {
		moduleIds: 'deterministic',
		runtimeChunk: 'single',
		minimize: true,
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.s[ac]ss$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			},
			{
				test: /\.(png|gif|jpg|jpeg|svg|xml|ico)$/,
				use: ['url-loader']
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js', '.scss']
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'app/index.html'
		}),
		new CopywebpackPlugin({
			patterns: [
				{
					from: 'app/assets/**/*',
					to: 'assets/[name][ext]'
				},
				{
					from: 'app/favicon.ico',
					to: 'favicon.ico'
				}
			]
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
			chunkFilename: '[id].css'
		})
	],
	devServer: {
		static: path.join(__dirname, 'dist'),
		hot: true
	}
};
