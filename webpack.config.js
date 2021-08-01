/*
 * @Author: CL
 * @Date: 2021-07-14 22:30:59
 * @LastEditTime: 2021-07-16 11:06:57
 * @Description: 
 */

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  //入口文件
  entry: './src/index.ts',

  //出口文件
  output: {
    path: path.resolve('./dist'),
    filename: 'bundle.js'
  },

  //插件
  plugins: [
    //讲public下的index.html打包到dist目录
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),

    new CleanWebpackPlugin()
  ],

  module: {
    rules: [
      { test: /.ts$/, loader: 'ts-loader', options: { transpileOnly: true } }
    ]
  },

  resolve: {
    extensions: ['.ts', '.js']
  }
}
