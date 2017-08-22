var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'

var postcss = [
  require('autoprefixer')({
    browsers: ['last 10 versions']
  }),
]
var postcssPx2rem = (function() {
  if (config.px2rem.enable) {
    return require('postcss-px2rem')(config.px2rem);
  }
})();
if (postcssPx2rem) postcss.push(postcssPx2rem);
module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  postcss: postcss,
}
