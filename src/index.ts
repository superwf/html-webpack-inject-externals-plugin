/* eslint-disable import/first */
import { existsSync } from 'fs'
import { join as pathJoin } from 'path'

import { rgb } from 'chalk'
import type { HtmlTagObject } from 'html-webpack-plugin'
import HtmlWebpackPlugin = require('html-webpack-plugin')
import urlJoin from 'url-join'
import type { Compiler, WebpackPluginInstance } from 'webpack'

import type { PackageOption, PackageTagAttribute, PluginOption } from './type'

export class HtmlWebpackInjectExternalsPlugin implements WebpackPluginInstance {
  public name = 'HtmlWebpackInjectExternalsPlugin'

  public options: PluginOption

  constructor(options: PluginOption) {
    this.options = options
  }

  public apply(compiler: Compiler) {
    const generalHost = this.options.host
    const getUmdPath = (pkg: PackageOption): PackageTagAttribute => {
      const { host, path, fullPath, name } = pkg
      if (fullPath) {
        return {
          url: fullPath,
          attributes: pkg.attributes,
        }
      }
      let pkgInfo = {} as any
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
          throw new Error(`get package ${name} package.json failed`)
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
        afterInjectTag: pkg.afterInjectTag,
      }
    }
    const deps = this.options.packages.map(getUmdPath)
    const tags = deps.reduce<HtmlTagObject[]>((r, d) => {
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
      r.push(result)
      if (d.afterInjectTag) {
        r.push(d.afterInjectTag)
      }
      return r
    }, [])

    compiler.hooks.compilation.tap(this.name, compilation => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tap(this.name, data => {
        /** remove repeat */
        const toPrependTags: any = []
        tags.reverse().forEach(tag => {
          const url = tag.tagName === 'script' ? tag.attributes.src : tag.attributes.href
          const exist = data.headTags.some(headTag => {
            const headTagUrl = headTag.tagName === 'script' ? headTag.attributes.src : headTag.attributes.href
            return headTagUrl === url
          })
          if (!exist) {
            data.headTags.unshift(tag)
            toPrependTags.push(tag)
          }
        })

        console.log(rgb(73, 204, 144)(`[${this.name}] has prepend these resources in your html head:`))
        toPrependTags.forEach((tag: any) => {
          console.log(rgb(137, 191, 4)(JSON.stringify(tag)))
        })
        return data
      })
    })
  }
}
