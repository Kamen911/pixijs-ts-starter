const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/images/[name][ext]"
                }
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "./"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./templates/index.html"
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "./templates/style.css", to: "style.css" },
                { from: "./src/assets", to: "assets" }
            ]
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, "dist")
        },
        compress: true,
        port: 8000,
        devMiddleware: {
            publicPath: "/"
        }
    }
};
