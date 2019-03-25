process.env.APP_VERSION = require('./package.json').version;

module.exports = {
  // configureWebpack: {
  //   rules: [
  //     {
  //       test: /map_html\.html$/,
  //       use: {
  //         loader: 'html-loader',
  //         options: {
  //           attrs: [':data-src']
  //         }
  //       }
  //     }
  //   ],
  // },
  chainWebpack: config => {
    config.module
      .rule('html')
      .test(/map_html\.html$/)
      .use('html-loader')
        .loader('html-loader')
        .end()
  },
};
