const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    "mode": 'production',
    "entry": "./src/index.js",
    "output": {
        "path": __dirname + '/dist',
        "filename": "[name].js"
    },
    plugins: [
        new CopyPlugin([{
            from: './src/static',
            to: ''
        },]),
    ],
    "module": {
        "rules": [
            {
                "test": /\.js$/,
                "exclude": /node_modules/,
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: [
                    'raw-loader',
                    'glslify-loader'
                ]
            },
            // {
            //     test: /\.scss$/,
            //     "exclude": /node_modules/,
            //     use: [{
            //         loader: "style-loader"
            //     }, {
            //         loader: "css-loader", options: {
            //             sourceMap: true
            //         }
            //     }, {
            //         loader: "sass-loader", options: {
            //             sourceMap: true
            //         }
            //     }]
            // }
        ]
    }
}