const path = require('path');
const webpackConfig = require('./webpack.base.js');
const {merge} = require('webpack-merge');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // 对CSS进行压缩
const TerserPlugin = require('terser-webpack-plugin'); // 对js进行压缩
const HappyPack = require('happypack');
const os = require("os");
// 创建 happypack 共享进程
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => {
	console.log("模式:", argv);

	if (argv.report === true) {
		webpackConfig.plugins.push(

		);
	}

	return merge(webpackConfig, {
		mode: argv.mode,
		devtool: "cheap-module-source-map",
		plugins: [
			// 默认配置的具体配置项
			new BundleAnalyzerPlugin({
				analyzerMode: 'disabled',
				analyzerHost: '127.0.0.1',
				analyzerPort: '8888',
				reportFilename: 'report.html',
				defaultSizes: 'parsed',
				openAnalyzer: false,
				generateStatsFile: true,
				statsFilename: path.resolve(__dirname, "../stats.json"),
				statsOptions: {source: false},
				excludeAssets: null,
				logLevel: "error"
			}),
			//拷贝
			new CopyWebpackPlugin({
				patterns: [
					{from: path.resolve(__dirname, '../public/favicon.ico')},
				],
			}),
			new HappyPack({
				id: 'babel', // TODO 必须配置 id 标识符，要和 rules 中指定的 id 对应起来
				// 使用共享进程池中的进程处理任务
				threadPool: happyThreadPool,
				// 需要使用的 loader，用法和 rules 中 Loader 配置一样, 可以直接是字符串，也可以是对象形式
				loaders: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						},
						cacheDirectory: true,
					}
				],
				//不输出消息
				verbose: false,
			}),
		],
		optimization: {
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						// https://github.com/terser/terser#minify-options
						compress: {
							warnings: false, // 删除无用代码时是否给出警告
							drop_debugger: true, // 删除所有的debugger
							// drop_console: true, // 删除所有的console.*
							pure_funcs: [''],
							// pure_funcs: ['console.log'], // 删除所有的console.log
						},
					},
				}),
				new CssMinimizerPlugin(),
			],
			splitChunks: {
				chunks: 'all',
				minSize: 30,  //提取出的chunk的最小大小
				cacheGroups: {
					vendors: {  //拆分第三方库（通过npm|yarn安装的库）
						name: 'vendor',
						test: /[\\/]node_modules[\\/]/,
						chunks: 'initial',
						priority: -10,
					},
					default: {
						name: 'common',
						chunks: 'initial',
						minChunks: 2,  //模块被引用2次以上的才抽离
						priority: -20
					},
				}
			}
		},
		//处理
		module: {
			rules: [
				//js
				{
					test: /\.js$/,
					use: ['happypack/loader?id=babel'],
					exclude: /node_modules/
				},
			]
		}
	})
}
