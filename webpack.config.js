let webpack = require('webpack');
let uglifyJsPlugin = require('uglifyjs-webpack-plugin');
let HtmlPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let loaders = require('./webpack.config.loaders')();
let path = require('path');

loaders.push({
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
        publicPath: './',
        fallback: 'style-loader',
        use: [{
            loader: 'css-loader',
            options: {
                sourceMap: true
            }
        }, {
            loader: 'sass-loader',
            options: {
                sourceMap: true
            }
        }]
    })
});

loaders.push({
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
    })
});

module.exports = {
    entry: {
        main: './src/js/index.js'
    },
    output: {
        filename: './js/[name].[hash].js',
        path: path.resolve('dist')
    },
    devtool: 'source-map',
    module: {
        loaders
    },
    plugins: [
        new uglifyJsPlugin({
            sourceMap: true
        }),
        new ExtractTextPlugin('./css/[name].[hash].css'),
        new HtmlPlugin({
            title: 'Friends Filter',
            template: './src/templates/index.hbs',
            filename: 'index.html',
            chunks: ['main']
        }),
        new CleanWebpackPlugin(['dist'])
    ]
};
