/* global __dirname, require, module*/
require('core-js/es/string/replace-all')
const path = require("path");
const yargs = require("yargs");
const env = yargs.argv.env; // use --env with webpack 2
const pkg = require("./package.json");
const shouldExportToAMD = yargs.argv.amd;

let libraryName = pkg.name;
libraryName = libraryName
  .replaceAll('@', '')
  .replaceAll('/', '_')
  .replaceAll('.', '_')

let outputFile, mode;

if (shouldExportToAMD) {
  libraryName += ".amd";
}

if (env === "build") {
  mode = "production";
  outputFile = libraryName + ".min.js";
} else {
  mode = "development";
  outputFile = libraryName + ".js";
}

const config = {
  mode: mode,
  entry: __dirname + "/src/index.ts",
  devtool: "source-map",
  output: {
    path: __dirname + "/lib",
    filename: outputFile,
    library: libraryName,
    libraryTarget: shouldExportToAMD ? "amd" : "amd",
    libraryExport: "default",
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  module: {
    rules: [
      {
        test: /(\.ts)$/,
        use: 'ts-loader'
      },
      {
        test: /(\.jsx|\.js|\.ts)$/,
        use: {
          loader: "babel-loader",
        },
        exclude: /(node_modules|bower_components)/,
      },
    ],
  },
  resolve: {
    modules: [path.resolve("./node_modules"), path.resolve("./src")],
    extensions: [".json", ".js"],
  },
};

module.exports = config;
