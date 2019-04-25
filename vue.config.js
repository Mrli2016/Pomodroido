const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack')
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir)
}

// Generate pages object
const pagesObj = {};

const chromeName = ["popup", "options", "background", "content_script"];

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

module.exports = {
  pages: pagesObj,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      }),
      CopyWebpackPlugin([
        manifest,
        {
          from: path.resolve("src/styles/content.css"),
          to: `${path.resolve("dist")}/styles/content.css`
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
    ],
    output: {
      filename: "js/[name].js"
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'))
  }
};