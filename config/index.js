'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        // 我要请求的地址
        target: 'http://localhost:8070',
        //是否跨域
        changeOrigin: true,
        // 重写地址
        pathRewrite: {
          '^/api': ''
        }
      },
      '/dev': {
        // 我要请求的地址
        target: 'http://172.16.202.214:32201',
        //是否跨域
        changeOrigin: true,
        // 重写地址
        pathRewrite: {
          '^/dev': ''
        }
      },
      '/lpc': {
        // 我要请求的地址
        target: 'http://192.168.14.176:32601',
        //是否跨域
        changeOrigin: true,
        // 重写地址
        pathRewrite: {
          '^/lpc': ''
        }
      },
      '/zz': {
        // 我要请求的地址
        target: 'http://192.168.14.28:32601',
        //是否跨域
        changeOrigin: true,
        // 重写地址
        pathRewrite: {
          '^/zz': ''
        }
      },
      '/': {
        // 我要请求的地址
        target: 'http://172.16.200.110:30111',
        //是否跨域
        changeOrigin: true,
        // 重写地址
        pathRewrite: {
          '^/': ''
        }
      },

    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8085, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    //相对地址-绝对地址---//编译发布的根目录，可配置为资源服务器域名或 CDN 域名
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
