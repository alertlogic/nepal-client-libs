const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (env) => {

  return {
    mode: 'production',
    entry: {
      'index': path.resolve(__dirname, './dist/commonjs/index.js')
    },
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    output: {
      path: path.resolve(__dirname, './dist/umd'),
      filename: '[name].js',
      library: 'aimsClient',
      libraryTarget: 'umd', // supports commonjs, amd and web browsers
      globalObject: 'this'
    },
  };

};
