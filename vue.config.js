const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ZipPlugin = require('zip-webpack-plugin')
const webpack = require('webpack')
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir)
}

// Generate pages object
const pagesObj = {};

const chromeName = ["popup", "background", "content_script"];

chromeName.forEach(name => {
  pagesObj[name] = {
    entry: `src/${name}/index.js`,
    template: "index.html",
    filename: `${name}.html`
  };
});

const manifest =
  process.env.NODE_ENV === "production" ? {
    from: path.resolve("src/manifest.production.json"),
    to: `${path.resolve("dist")}/manifest.json`
  } : {
    from: path.resolve("src/manifest.development.json"),
    to: `${path.resolve("dist")}/manifest.json`
  };

let plugins = [
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  }),
  CopyWebpackPlugin([
    manifest,
    {
      from: path.resolve("src/styles/content.css"),
      to: `${path.resolve("dist")}/css/content.css`
    },
    {
      from: path.resolve("src/assets/icons"),
      to: `${path.resolve("dist")}/assets/icons`
    },
    {
      from: path.resolve("src/*.js"),
      to: `${path.resolve("dist")}`
    },
  ]),
  // // keep module.id stable when vendor modules does not change
  // new webpack.HashedModuleIdsPlugin(),
  // // enable scope hoisting
  // new webpack.optimize.ModuleConcatenationPlugin(),
]

// 生产环境打包dist为zip
if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new ZipPlugin({
      path: path.resolve("dist"),
      filename: 'dist.zip',
    })
  )
}

module.exports = {
  pages: pagesObj,

  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,

  configureWebpack: {
    plugins: plugins,
    output: {
      filename: "js/[name].js"
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_console: true, //console
              drop_debugger: false,
              pure_funcs: ['console.log'] //移除console
            }
          }
        })
      ]
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'))
  }
};