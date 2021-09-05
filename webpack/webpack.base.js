const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const vueLoaderPlugin = require('vue-loader/lib/plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
module.exports = {
	entry: {
		main: path.resolve(__dirname, '../src/main.js'),
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: "[name].[fullhash].js",
		chunkFilename: 'js/[name].[fullhash].js',
		publicPath: './', //通常是CDN地址
	},
	resolve: {
		//支持vue
		alias: {
			'vue$': 'vue/dist/vue.runtime.esm.js',
			'@': path.resolve(__dirname, '../src'), //导入要加上@
		},
		extensions: ['*', '.js', '.json', 'jsx', '.vue'],
		// 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
		modules: [path.resolve(__dirname,'../node_modules')]
	},
	watchOptions: {
		// 不监听的文件或文件夹，支持正则匹配
		ignored: path.resolve(__dirname,'../node_modules'),
		// 监听到变化后等300ms再去执行动作
		aggregateTimeout: 500,
		// 默认每秒询问1000次
		poll: 10
	},
	plugins: [
		new ProgressBarPlugin({
			format: '  构建中: [:bar] [:percent] (:elapsed 秒)\n',
		}),
		new vueLoaderPlugin(),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../public/index.html'),
			filename: 'index.html',
			chunks: ['main'] // 与入口文件对应的模块名
		}),
		new MiniCssExtractPlugin({
			filename: "[name].[chunkhash:8].css",
			chunkFilename: "[id].css",
		}),
	],
	cache: {
		// 将缓存类型设置为文件系统
		type: "filesystem",
		buildDependencies: {
			/* 将你的 config 添加为 buildDependency，以便在改变 config 时获得缓存无效*/
			config: [__filename],
			/* 如果有其他的东西被构建依赖，你可以在这里添加它们*/
			/* 注意，webpack.config，加载器和所有从你的配置中引用的模块都会被自动添加*/
		},
		compression: 'gzip',
		// 指定缓存的版本
		version: '1.0'
	},
	//处理
	module: {
		rules: [
			//Vue
			{
				test: /\.vue$/,
				use: ['vue-loader'],
				exclude: path.resolve(__dirname,'../node_modules'),
			},
			//js
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					}
				},
				// 排除第三方插件
				exclude:path.resolve(__dirname,'../node_modules'),
			},
			//样式文件
			{
				test: /\.css$/,
				exclude: path.resolve(__dirname,'../node_modules'),
				// 从右向左解析原则
				use: ['style-loader', {
					loader: 'css-loader',
					options: {
						importLoaders: 2,
						esModule: false,
					}
				}, 'postcss-loader'],
			},
			{
				test: /\.less$/,
				exclude: path.resolve(__dirname,'../node_modules'),
				use: [MiniCssExtractPlugin.loader, 'style-loader', 'css-loader', 'postcss-loader', 'less-loader'] // 从右向左解析原则
			},
			//图片文件
			{
				test: /\.(jpe?g|png|gif)$/i, //图片文件
				exclude: path.resolve(__dirname,'../node_modules'),
				include: path.resolve(__dirname, "../src/assets/images"),
				type: 'asset',
				generator: {
					// [ext]前面自带"."
					filename: 'images/[hash:8].[name][ext]',
				},
				parser: {
					dataUrlCondition: {
						maxSize: 1024 * 8, // 8kb
					}
				}
			},
			// 字体
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
				exclude: path.resolve(__dirname,'../node_modules'),
				include: path.resolve(__dirname, "../src/assets/fonts"),
				type: "asset/resource",
				generator: {
					// [ext]前面自带"."
					filename: 'fonts/[hash:4].[name][ext]',
				},
			},
		]
	}

}