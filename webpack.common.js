const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: {
        home: './src/index.js',
        chargers: './src/chargers/index.js',
        chargersMap: './src/chargersmap/index.js',
        'firebase-messaging-sw': './src/firebase-messaging-sw.js'
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
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
    optimization: {
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            // `...`,
            new CssMinimizerPlugin(),
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