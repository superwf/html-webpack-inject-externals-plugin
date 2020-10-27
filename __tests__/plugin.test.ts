import * as fs from 'fs'
import * as path from 'path'

import HtmlWebpackPlugin = require('html-webpack-plugin')
import webpack from 'webpack'
import { HtmlWebpackLoadUnpkgScriptsPlugin } from '../src/index'


const resolveRoot = (str: string) => path.resolve(__dirname, '..', str)

describe('生成html注入script', () => {
  it('添加script标签到head', done => {
    webpack(
      {
        mode: 'development',
        entry: resolveRoot('__tests__/fixture/index.js'),
        output: {
          filename: '[name].js',
          // module: true,
        },
        // experiments: {
        //   outputModule: true,
        //   syncWebAssembly: true,
        //   topLevelAwait: true,
        //   asyncWebAssembly: true,
        // },
        plugins: [
          new HtmlWebpackLoadUnpkgScriptsPlugin({
            externals: {
              lodash: '_',
            },
            host: 'http://unpkg.jd.com',
            packages: [
              {
                name: 'lodash',
                path: '/lodash.js',
                attributes: {
                  type: 'module',
                },
              },
            ],
          }),
          new HtmlWebpackPlugin({
            inject: true,
            template: resolveRoot('__tests__/fixture/index.html'),
          }),
        ],
      },
      err => {
        expect(err).toBe(null)
        expect(fs.readFileSync('./dist/index.html', 'utf-8')).toMatchSnapshot()
        done()
      },
    )
  })
})
