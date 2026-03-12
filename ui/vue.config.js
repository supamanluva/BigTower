const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  parallel: false, // Disable parallel build to avoid Thread Loader errors
  devServer: {
    host: '0.0.0.0',
    proxy: {
      "^/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      },
      "^/auth": {
        target: "http://localhost:3000",
        changeOrigin: true
      },
    }
  },

  pwa: {
    name: "BigTower",
    themeColor: "#1565C0",
    msTileColor: "#1565C0",
    mobileWebAppCapable: "no",
    manifestOptions: {
      short_name: "BigTower",
      background_color: "#ffffff",
    },
    iconPaths: {
      faviconSVG: 'img/icons/favicon.svg',
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon.png',
      msTileImage: 'img/icons/android-chrome-192x192.png',
      maskIcon: null,
    },
  },

  chainWebpack: config => {
    // Prioritize .vue files
    config.resolve.extensions.prepend('.vue');
    config.plugin('fork-ts-checker').tap(args => {
      args[0].typescript = {
        ...args[0].typescript,
        configFile: 'tsconfig.build.json'
      }
      return args
    })

    config.module
      .rule('ts')
      .use('ts-loader')
      .loader('ts-loader')
      .tap(options => {
        return {
          ...options,
          configFile: 'tsconfig.build.json',
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true
        }
      })
  },

  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: "true",
        __VUE_PROD_DEVTOOLS__: "false",
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
      }),
    ],
  },
});
