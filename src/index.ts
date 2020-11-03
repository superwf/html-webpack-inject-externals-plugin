/* eslint-disable import/first */
import { existsSync } from 'fs'
import { join as pathJoin } from 'path'

import { bgRgb, rgb } from 'chalk'
import type { HtmlTagObject } from 'html-webpack-plugin'
import HtmlWebpackPlugin = require('html-webpack-plugin')
import urlJoin from 'url-join'
import type { Compiler } from 'webpack'

import { mergeExternals } from './mergeExternals'
import { DEP } from './runtimeTemplate'

export type PACKAGE_OPTION = {
  host?: string
  name: string
  path?: string
  /** when has fullPath, all other props will be ignored */
  fullPath?: string
  attributes?: Record<string, string | boolean>
}

export interface OPTION {
  externals?: {
    [packageName: string]: string | string[]
  }
  host?: string
  packages: PACKAGE_OPTION[]
  attributes?: Record<string, string | boolean>
}

export class HtmlWebpackInjectExternalsPlugin {
  public name = 'HtmlWebpackInjectExternalsPlugin'

  public options: OPTION

  constructor(options: OPTION) {
    this.options = options
  }

  public apply(compiler: Compiler) {
    if (this.options.externals) {
      const externals = mergeExternals(this.options.externals, compiler.options.externals)
      if (externals) {
        compiler.options.externals = externals
      }
    }

    const generalHost = this.options.host
    const getUmdPath = (pkg: PACKAGE_OPTION): DEP => {
      const { host, path, fullPath, name } = pkg
      if (fullPath) {
        return {
          url: fullPath,
          attributes: pkg.attributes,
        }
      }
      let pkgInfo: any = {}
      /** mono packages project need to inspact node_modules in more place */
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require
        pkgInfo = require(`${name}/package.json`)
      } catch (e) {
        const currentPathPkgPath = pathJoin(process.cwd(), 'node_modules', `${name}/package.json`)
        if (existsSync(currentPathPkgPath)) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require
          pkgInfo = require(currentPathPkgPath)
        } else {
          throw new Error(`package ${name} missing umd path`)
        }
      }
      const { version, unpkg, browser, umd } = pkgInfo
      const unpkgHost = host || generalHost
      /**
       * try to guess the browser env usage file path
       * the guess order is reference from unpkg project
       * */
      const pkgUmdPath = path !== undefined ? path : unpkg || browser || umd || ''
      if (!unpkgHost) {
        throw new Error(`package ${name} missing host`)
      }
      const url = fullPath || urlJoin(unpkgHost, `${name}@${version}`, pkgUmdPath)
      return {
        url,
        version,
        attributes: pkg.attributes,
      }
    }
    const deps = this.options.packages.map(getUmdPath)
    const tags = deps.map(d => {
      const result: HtmlTagObject = d.url.endsWith('.css')
        ? {
            tagName: 'link',
            voidTag: true,
            attributes: {
              rel: 'stylesheet',
              href: d.url,
              ...this.options.attributes,
              ...d.attributes,
            },
          }
        : {
            tagName: 'script',
            voidTag: false,
            attributes: {
              defer: false,
              src: d.url,
              ...this.options.attributes,
              ...d.attributes,
            },
          }
      return result
    })

    compiler.hooks.compilation.tap(this.name, compilation => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tap(this.name, data => {
        /** remove repeat */
        tags.reverse().forEach(tag => {
          const url = tag.tagName === 'script' ? tag.attributes.src : tag.attributes.href
          const exist = data.headTags.some(headTag => {
            const headTagUrl = headTag.tagName === 'script' ? headTag.attributes.src : headTag.attributes.href
            return headTagUrl === url
          })
          if (!exist) {
            data.headTags.unshift(tag)
          }
        })

        console.log(rgb(145, 213, 255)(`${this.name} prepend these resource in your html head:`))
        console.log(bgRgb(62, 44, 127)(deps.map(d => d.url).join('\n')))
        return data
      })
    })
  }
}
