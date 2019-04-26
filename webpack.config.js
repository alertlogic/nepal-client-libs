const path = require('path');
const PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');

module.exports = (env) => {

  return {
    mode: 'production',
    entry: {
      'index': path.resolve(__dirname, './dist/commonjs/index.js')
    },
    output: {
      path: path.resolve(__dirname, './dist/umd'),
      filename: '[name].js',
      library: 'aimsClient',
      libraryTarget: 'umd', // supports commonjs, amd and web browsers
      globalObject: 'this'
    },
    plugins: [
      new PeerDepsExternalsPlugin()
    ]
  };

};
