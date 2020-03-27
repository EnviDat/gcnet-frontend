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
  chainWebpack: config => {
    config.module
      .rule('html')
      .test(/map_html\.html$/)
      .use('html-loader')
        .loader('html-loader')
        .end()
  },
};
