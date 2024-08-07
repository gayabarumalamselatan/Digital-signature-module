const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Call dotenv and it will return an Object with a parsed key 
const env = dotenv.config({ path: './.env.development' }).parsed;

// Reduce it to a nice object, the same as before (but with the variables from .env)
const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
}, {});

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
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto'
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
                './CreateMemo': './src/Components/CreateMemo',
                './ViewMemo': './src/Components/ViewMemo',
                './MemoReport': './src/Components/MemoReport',
                './VerifyMemo': './src/Components/VerifyMemo',
            },
            shared: {
                react: { singleton: true, eager: true, requiredVersion: '17.0.2' },
                'react-dom': { singleton: true, eager: true, requiredVersion: '17.0.2' },
            },
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'], // Provide a polyfill for the Buffer variable if needed
        }),
        new webpack.DefinePlugin(envKeys),
    ],
    // Optionally, you can specify a resolve section for resolving file extensions
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};
