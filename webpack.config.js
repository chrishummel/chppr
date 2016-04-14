var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, "/"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./client/client.js",
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      },
      { 
        test: /\.json$/,
        loader: "json-loader"
      }
    ]
  },
  output: {
    path: __dirname + "/client/",
    filename: "client.min.js"
  },
   resolve: {
    // Can require('file') instead of require('file.js') etc.
    extensions: ['', '.js', '.json']
  },
  
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ]
};
