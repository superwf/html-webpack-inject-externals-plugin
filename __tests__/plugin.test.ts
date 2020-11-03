import * as fs from 'fs'
import * as path from 'path'
import webpack from 'webpack'
import { HtmlWebpackInjectExternalsPlugin } from '../src/index'

import HtmlWebpackPlugin = require('html-webpack-plugin')

const resolveRoot = (str: string) => path.resolve(__dirname, '..', str)

describe('生成html注入script', () => {
  it('添加script标签到head', done => {
    webpack(
      {
        mode: 'development',
        entry: resolveRoot('__tests__/fixture/index.js'),
        output: {
          filename: '[name].js',
          path: resolveRoot('__tests__/output'),
          publicPath: '/',
        },
        plugins: [
          new HtmlWebpackInjectExternalsPlugin({
            externals: {
              lodash: '_',
            },
            host: 'http://unpkg.jd.com',
            packages: [
              {
                name: 'lodash',
                path: '/lodash.js',
                attributes: {
                  preload: true,
                },
              },
              {
                name: 'animate.css',
                fullPath: 'http://unpkg.jd.com/animate.css@4.1.0/animate.css',
              },
            ],
          }),
          new HtmlWebpackPlugin({
            cache: false,
            inject: 'body',
            filename: 'index.html',
            template: resolveRoot('public/index.html'),
          }),
        ],
      },
      err => {
        expect(err).toBe(null)
        expect(fs.readFileSync(resolveRoot('__tests__/output/index.html'), 'utf-8')).toMatchSnapshot()
        done()
      },
    )
  })
})
