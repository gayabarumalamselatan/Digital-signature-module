const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

module.exports = {
    entry: './src/index',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'signaturemodule'),
        publicPath: 'auto',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader", // Creates `style` nodes from JS strings
                    "css-loader",   // Translates CSS into CommonJS
                ],
            },
            {
                test: /\.svg$/,
                use: ['file-loader'],
            },
            // Additional loaders for other file types can be added here
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'gritsignaturemodule',
            filename: 'signatureModule.js',
            exposes: {
                './Create': './src/Components/Create',
                './Report': './src/Components/Report',
                './View': './src/Components/View'
            },
            shared: {
                react: { singleton: true, requiredVersion: '17.0.2' },
                'react-dom': { singleton: true, requiredVersion: '17.0.2' },
            },
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    // Optionally, you can specify a resolve section for resolving file extensions
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};
