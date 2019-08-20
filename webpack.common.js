module.exports = {
    "entry": "./src/index.js",
    "output": {
        "path": __dirname + '/dist',
        "filename": "[name].js"
    },
    "module": {
        "rules": [
            {
                "enforce": "pre",
                "test": /\.(js|jsx)$/,
                "exclude": /node_modules/,
                //     "use": "jshint-loader"
            },
            {
                "test": /\.js$/,
                "exclude": /node_modules/,
                "use": {
                    "loader": "babel-loader",
                    "options": {
                        "presets": [
                            "env"
                        ]
                    }
                }
            },
            {
                test: /\.scss$/,
                "exclude": /node_modules/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader", options: {
                        sourceMap: true
                    }
                }, {
                    loader: "sass-loader", options: {
                        sourceMap: true
                    }
                }]
            }
        ]
    }
}
// "use strict";

// var webpack = require('webpack');
// var path = require('path');
// var CompressionPlugin = require("compression-webpack-plugin");
// const UglifyESPlugin = require('uglifyes-webpack-plugin');

// var env = process.env.NODE_ENV || 'development';
// var isProduction = env == 'production';

// var plugins = [
//   new webpack.DefinePlugin({
//     'PRODUCTION': isProduction
//   })
// ];

// if (isProduction) {
//   console.log("running production build...");
//   plugins = plugins.concat([
//     new webpack.optimize.OccurenceOrderPlugin(),
//     new webpack.optimize.DedupePlugin(),
//     new UglifyESPlugin({
//       compress: { warnings: false },
//       output: { comments: false }
//     }),
//     new webpack.NoErrorsPlugin(),
//     new CompressionPlugin({
//       asset: "[path].gz[query]",
//       algorithm: "gzip",
//       test: /\.(js|html)$/,
//       threshold: 10240,
//       minRatio: 0.8
//     })
//   ]);
// }

// module.exports = {
//   devtool: 'inline-source-map',

//   entry: {
//     app: './src/index'
//   },

//   output: {
//     path: path.join(__dirname, 'dist'),
//     filename: 'b.js'
//   },

//   plugins: plugins,

//   resolve: {
//     extensions: ['', '.js', 'json']
//   }
// };

