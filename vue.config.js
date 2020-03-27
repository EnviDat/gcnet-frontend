const fs = require('fs');

const version = require('./package.json').version;
process.env.VUE_APP_VERSION = version;

if (process.env.NODE_ENV === 'production') {
  const fileName = `version_${version}.txt`;
  const filePath = `${__dirname}/public/${fileName}`;

  fs.writeFile(filePath, version, (err) => {

    if (err) {
      return console.log(`Tried to created file ${fileName}. Error: ${err}`);
    }

    return console.log(`Created version file ${fileName} for easy build version highlight.`);
  });
}

console.log(`starting ${version} with on ${process.env.NODE_ENV}`);


module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  publicPath: './',
  assetsDir: './static',
  runtimeCompiler: true,
  css: {
    modules: false,
    sourceMap: true,
  },
  transpileDependencies: [
    'vuetify',
    'date-fns',
  ],
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
