const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const es2015 = require('babel-preset-es2015');
const react = require('babel-preset-react');
const stage1 = require('babel-preset-stage-1');
const transformRegenerator = require('babel-plugin-transform-regenerator');
const transformRuntime = require('babel-plugin-transform-runtime');
const transformObjectAssign = require('babel-plugin-transform-object-assign');
const transformFunctionBind = require('babel-plugin-transform-function-bind');

const sourceMap = new webpack.SourceMapDevToolPlugin({
  test: /\.(js|jsx|es6|less|css)$/
});

const uglifyJS = new UglifyJSPlugin({
  global: true,
  mangle: true,
  compress: {
    sequences: true,
    dead_code: true,
    conditionals: true,
    booleans: true,
    unused: true,
    if_return: true,
    join_vars: true,
    drop_console: true,
    booleans: true,
    loops: true,
    hoist_funs: true,
    cascade: true
  }
})


//stylesheets

const cssRulesLinkStyle = [
  'file-loader',
  'extract-loader',
  {
    loader: 'css-loader',
    options: {
      sourceMap: true,
      minimize: true,
      importLoaders: 1,
      modules: false,
      localIdentName: '[path][name]__[local]--[hash:base64:5]'
    }
  },{
    loader: 'less-loader',
    options:{
      sourceMap: true
    }
  },{
    loader: 'postcss-loader',
    options: {
      plugins: function() {
        return [
          require('precss'),
          require('autoprefixer')
        ];
      }
    }
  }
];

const cssRulesInlineStyle = [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      sourceMap: true,
      minimize: true,
      importLoaders: 1,
      modules: false,
      localIdentName: '[path][name]__[local]--[hash:base64:5]'
    }
  },{
    loader: 'less-loader',
    options:{
      sourceMap: true
    }
  },{
    loader: 'postcss-loader',
    options: {
      plugins: function() {
        return [
          require('precss'),
          require('autoprefixer')
        ];
      }
    }
  }
];



function done() {
  this.plugin('done', stats => {
    fs.readFile('./index.html', (err, data) => {
      const $ = cheerio.load(data.toString());
      $('script[src*=bundle]').attr('src', stats.hash+'.js');
      fs.writeFile( path.join(this.options.output.path, 'index.html'), $.html(), err => {
          !err && console.log('Set has success: '+stats.hash)
      })
    })
  });
}

const indexHtml = path.join(__dirname, "index.html");
const entryJs = path.join(__dirname, "app/index.js");


module.exports = {
  entry: ['webpack-dev-server/client?http://localhost:8080', entryJs, indexHtml],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'http://img.99bill.com/res/',
  },
  plugins: [uglifyJS, done],
  devServer: {
    inline: true,
    stats: {
      colors: true
    },
    // hot: true,
    inline: true,
    compress: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  module: {
    rules: [{
      test: /\.html$/i,
      use: [{
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        },
        'extract-loader',
        {
          loader: 'html-loader',
          options: {
            attrs: ['img:src', 'img:data-src', 'link:href']
          }
        }
      ]
    }, {
      test: /\.(css|less)$/,
      use: cssRulesLinkStyle
    }, {
      test: /.*\.(gif|png|jpe?g|svg)$/i,
      use: ['file-loader']
    }, {
      test: /\.(js|jsx|es6)$/,
      exclude: /(node_modules|bower_components)/,
      enforce: 'pre',
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [es2015, react, stage1],
          plugins: [
            transformRegenerator,
            transformRuntime,
            transformFunctionBind,
            transformObjectAssign
          ]
        }
      }]
    }]
  },
  resolve:{
    alias:{
      'webpack-dev-server/client': path.join(__dirname, 'node_modules/webpack-dev-server/client'),
      'babel-runtime': path.join(__dirname, 'node_modules/babel-runtime')
    }
  },
  resolveLoader: {
      moduleExtensions: ['-loader', 'webpack-dev-server/client'],
      modules: [ path.join(__dirname, 'node_modules'), 'node_modules']
  }
};
