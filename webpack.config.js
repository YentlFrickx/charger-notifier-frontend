const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'development',
    entry: {
        home: './src/index.js',
        chargers: './src/chargers/index.js',
        // map: './src/chargersmap/map.js',
        chargersMap: './src/chargersmap/index.js',
        'firebase-messaging-sw': './src/firebase-messaging-sw.js'
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src'),
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            inject: 'body',
            template: './src/index.html',
            filename: 'index.html',
            chunks: [
                "home"
            ]
        }),
        new HtmlWebpackPlugin({
            inject: 'body',
            template: './src/chargers/index.html',
            filename: 'chargers/index.html',
            chunks: [
                "chargers"
            ]
        }),
        new HtmlWebpackPlugin({
            inject: 'body',
            template: './src/chargersmap/index.html',
            filename: 'chargersmap/index.html',
            scriptLoading: 'blocking',
            chunks: [
                "chargersMap"
            ]
        })

    ]
}