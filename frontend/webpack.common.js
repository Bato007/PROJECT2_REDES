const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/App.jsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
    publicPath: '/',
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: 'dist',
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(jsx?)$/,
        use: ['babel-loader'],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|jpg|png|gif|woff|woff2|eot|ttf|pdf|svg|otf|mp4|JPG)(\?[a-z0-9=.]+)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8192,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.js', '.jsx'],
    fallback: {
      'react/jsx-runtime': 'react/jsx-runtime.js',
      'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
    },
  },
  plugins: [new HtmlWebpackPlugin({
    favicon: './assets/favicon.png',
    templateContent:
      `
    <!DOCTYPE html>
    <html>
      <head>
      <base href="/">
      </head>
      <meta charset="UTF-8">
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <title>Exploding Kittens</title>
      <body>
        <div id="root"></div>
      </body>
    </html> `,
  }),
  new CopyWebpackPlugin({
    patterns: [
      { from: 'assets', to: 'assets' },
    ],
  }),
  ],
}
