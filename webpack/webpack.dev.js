const path = require('path');
const webpackConfig = require('./webpack.base.js')
const {merge} = require('webpack-merge');

module.exports = (env,argv) => {
	console.log("模式:", argv);
	return merge(webpackConfig, {
		output:{
			publicPath: '/', //开发环境是"/" 正式环境是 "./"
		},
		mode: argv.mode,
		devtool: 'eval-source-map',
		devServer: {
			port: 8989,
			hot: true,
			open: true,
			https: false,
			compress: false,
			client: {
				overlay: true,
			},
			static: [
				{directory: path.join(__dirname, '../src/assets')},
				{directory: path.join(__dirname, '../public')}
			],
		},
	})
}
