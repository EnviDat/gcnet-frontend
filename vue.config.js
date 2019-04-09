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
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // devServer: {
  //   proxy: {
  //     '/gcnet': {
  //       target: 'https://www.envidat.ch/ui/proxy/ServiceProxyServlet?server=0&serverpath=',
  //       secure: true,
  //       pathRewrite: {
  //         '^/api': '/v2/api',
  //       },
  //     }
  //   },
  // },  
  // proxyTable: {
  //   '/gcnet': {
  //     target: 'https://www.envidat.ch/ui/proxy/ServiceProxyServlet?server=0&serverpath=',
  //     /* target: 'http://www.envidat.ch', */
  //     changeOrigin: true,
  //     secure: false,
  //     // logLevel: 'debug',
  //     pathRewrite: function (path, req) {
  //       const from = path;
  //       // path = encodeURIComponent(path);
  //       path = path.replace('?', '&amp;');
  //       path = path.replace("'", "%22");
  //       console.log('replaced path from ' + from + ' to: ' + path);
  //       return path;
  //     }        
  //   },
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
