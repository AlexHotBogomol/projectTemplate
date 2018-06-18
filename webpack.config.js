const HtmlWebpackPlugin = require('html-webpack-plugin'); //плагин для генеации html страниц
const path = require('path'); //nodejs утилита для работы с путями
const DIST_PATH = path.resolve(__dirname, './dist'); //абсолютный путь к директории dist
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
	entry: './src/index.js', //точка входа
	output: {
		filename : '[name].js', //название файла на выходе
		path: DIST_PATH, // Куда все складывать
	},
	module: {
		rules: [
		{
			test: /\.js$/, //Все файлы с расширением js
			exclude: /node_modules|dist/, //За исключением директорий node_modules и dist
			use: [
				{
					loader: 'babel-loader', //Использовать babel-loader (компилировать ES6 в ES5)
					options: {presets: ["env"]}
				}
			] 
		},
		{
	    test: /\.(sa|sc|c)ss$/,
	    use: [
	     (devMode) ? 'style-loader' : MiniCssExtractPlugin.loader,
	    'css-loader',
      {loader: 'postcss-loader',
		    options: {
	        plugins: [
	            autoprefixer({
	                browsers:['ie >= 8', 'last 4 version']
	            })
	        ],
	        sourceMap: true
	    	}
			},
      'sass-loader',
	    ],
		}],
	},
	mode: "development",
	devtool : "source-map",
	devServer: {
		contentBase: DIST_PATH,
		port: 9000,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './templates/index.ejs',
			title: "Welcome"
		}),
		new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
	],
};
