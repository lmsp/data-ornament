const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack')

const isDebug = !process.argv.includes('-p')

// Desarrollo
const publicPathDev = '/'
const libraryNameDev = 'data-ornament.js'

// Productivo
const publicPathProd = '/'
const libraryNameProd = 'data-ornament.min.js'

let config = {
  plugins: [
    new HappyPack({
      id: 'js',
      cache: true,
      loaders: [
        {
          loader: 'babel-loader',
          exclude: /(node_modules|bower_components)/
        },
        {
          loader: 'eslint-loader',
          exclude: /node_modules/
        }
      ],
      threads: 4
    })
  ],
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: isDebug ? publicPathDev : publicPathProd,
    filename: isDebug ? libraryNameDev : libraryNameProd,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: 'happypack/loader?id=js'
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
    hot: true
  },
  devtool: isDebug ? 'source-map' : false
}

if (isDebug) {
  config.entry = './src/index.js'
  config.module.rules.push({
    test: /\.js$/,
    use: ['source-map-loader'],
    enforce: 'pre'
  })
} else {
  config.entry = './src/index.js'
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }))
}

module.exports = config
