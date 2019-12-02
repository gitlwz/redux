const path = require('path');

const config = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src/index.jsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    module: {
        rules: [{
            test: /\.(jsx|js)?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    "presets": [
                        [
                            "@babel/preset-env",
                            {
                                'useBuiltIns': 'usage'
                            }
                        ],
                        "@babel/preset-react"
                    ]
                }
            }
        }]
    },
    devtool: 'inline-source-map'
};

module.exports = config;