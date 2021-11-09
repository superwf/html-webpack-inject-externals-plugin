import * as fs from 'fs'
import * as path from 'path'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'

import { HtmlWebpackInjectExternalsPlugin } from '../src/index'

const resolveRoot = (str: string) => path.resolve(__dirname, '..', str)

describe('生成html注入script', () => {
  it('添加script标签到head', done => {
    webpack(
      {
        mode: 'development',
        entry: resolveRoot('__tests__/fixture/index.js'),
        output: {
          filename: '[name].js',
          path: resolveRoot('__tests__/output1'),
          publicPath: '/',
        },
        externals: {
          lodash: '_',
        },
        plugins: [
          new HtmlWebpackInjectExternalsPlugin({
            host: 'https://unpkg.com',
            packages: [
              {
                name: 'url-join',
                path: '/lib/url-join.js',
                injectBefore: {
                  tagName: 'script',
                  innerHTML: 'if (typeof urljoin === undefined) { console.log("urljoin not found") }',
                  voidTag: false,
                  attributes: {
                    type: 'javascript',
                  },
                },
              },
              {
                name: 'lodash',
                path: '/lodash.js',
                attributes: {
                  preload: true,
                },
                injectAfter: {
                  tagName: 'script',
                  innerHTML: 'const l = _',
                  voidTag: false,
                  attributes: {
                    type: 'javascript',
                  },
                },
              },
              {
                name: 'animate.css',
                fullPath: 'https://unpkg.com/animate.css@4.1.0/animate.css',
              },
            ],
          }),
          new HtmlWebpackPlugin({
            cache: false,
            inject: 'body',
            filename: 'index.html',
            template: resolveRoot('public/index.html'),
            scriptLoading: 'blocking',
          }),
        ],
      },
      err => {
        expect(err).toBe(null)
        expect(fs.readFileSync(resolveRoot('__tests__/output1/index.html'), 'utf-8')).toMatchSnapshot()
        done()
      },
    )
  })

  it('测试local模式，fullPath不受影响', done => {
    webpack(
      {
        mode: 'development',
        entry: resolveRoot('__tests__/fixture/index.js'),
        output: {
          filename: '[name].js',
          path: resolveRoot('__tests__/output2'),
          publicPath: '/',
        },
        externals: {
          lodash: '_',
        },
        plugins: [
          new HtmlWebpackInjectExternalsPlugin({
            host: 'https://unpkg.com',
            local: true,
            packages: [
              {
                name: 'url-join',
                path: '/lib/url-join.js',
                injectBefore: {
                  tagName: 'script',
                  innerHTML: 'if (typeof urljoin === undefined) { console.log("urljoin not found") }',
                  voidTag: false,
                  attributes: {
                    type: 'javascript',
                  },
                },
              },
              {
                name: 'lodash',
                path: '/lodash.js',
                localPrefix: 'static',
                attributes: {
                  preload: true,
                },
                injectAfter: {
                  tagName: 'script',
                  innerHTML: 'const l = _',
                  voidTag: false,
                  attributes: {
                    type: 'javascript',
                  },
                },
              },
              {
                name: 'animate.css',
                fullPath: 'https://unpkg.com/animate.css@4.1.0/animate.css',
              },
            ],
          }),
          new HtmlWebpackPlugin({
            cache: false,
            inject: 'body',
            filename: 'index.html',
            template: resolveRoot('public/index.html'),
            scriptLoading: 'blocking',
          }),
        ],
      },
      err => {
        expect(err).toBe(null)
        expect(fs.readFileSync(resolveRoot('__tests__/output2/index.html'), 'utf-8')).toMatchSnapshot()
        done()
      },
    )
  })
})
