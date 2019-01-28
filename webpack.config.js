const path = require('path');

module.exports = (env) => {

  return {
    entry: {
      'index': path.resolve(__dirname, './dist/commonjs/index.js')
    },
    output: {
      path: path.resolve(__dirname, './dist/umd'),
      filename: '[name].js',
      library: 'subscriptionsClient',
      libraryTarget: 'umd', // supports commonjs, amd and web browsers
      globalObject: 'this'
    }
  };

};
