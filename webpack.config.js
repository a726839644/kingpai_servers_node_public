var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        index: './src/js/entry.js'
    },
    output: {
        path: './public',
        filename: './js/index.js'
    },
    module: {
        loaders: [
            {
                test: /\.(css|less)$/, loader: ExtractTextPlugin.extract('style', 'css!less', {
                publicPath: '../'
            })
            },
            {test: /\.(png|jpg||gif)$/, loader: 'url?limit=4096&name=images/[hash:16].[ext]'},
            {test: /\.html$/, loader: 'html'}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        }),
        new ExtractTextPlugin('css/[name].css'),
        new webpack.optimize.CommonsChunkPlugin('js/common.js') // 提取公共代码的插件
    ],
    devServer:{
        inline:true,
        contentBase:'public'
    }
};