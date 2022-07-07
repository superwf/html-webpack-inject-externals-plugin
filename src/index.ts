/* eslint-disable import/first */
import { existsSync } from 'fs'
import { join as pathJoin } from 'path'

import chalk from 'chalk'
import cpfile from 'cp-file'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import type { HtmlTagObject } from 'html-webpack-plugin'
import urlJoin from 'url-join'
import type { Compiler, WebpackPluginInstance } from 'webpack'

import type { PackageOption, PackageTagAttribute, PluginOption, TagObject } from './type'

export class HtmlWebpackInjectExternalsPlugin implements WebpackPluginInstance {
  public name = 'HtmlWebpackInjectExternalsPlugin'

  public options: PluginOption

  constructor(options: PluginOption) {
    this.options = options
  }

  public apply(compiler: Compiler) {
    const generalHost = this.options.host
    const getBrowserFilePath = (pkg: PackageOption): PackageTagAttribute => {
      const { host, path, fullPath, name } = pkg
      if (fullPath) {
        return {
          url: fullPath,
          attributes: pkg.attributes,
          injectBefore: pkg.injectBefore,
          injectAfter: pkg.injectAfter,
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
      const browserFilePath = path !== undefined ? path : unpkg || browser || umd || ''
      /** 是否为本地模式 */
      const isLocal = Boolean(pkg.local !== undefined ? pkg.local : this.options.local)
      let url = ''
      if (isLocal) {
        const localPrefix = pkg.localPrefix || this.options.localPrefix || ''
        url = pathJoin('/', localPrefix, `${name}@${pkgInfo.version}/${browserFilePath}`)
        /**
         * clean-webpack-plugin will remove all copied files in done hook.
         * to work with clean-webpack-plugin, the copy task must delay to done hook
         * */
        compiler.hooks.done.tap('copy-vendor-file', () => {
          const packagePath = require.resolve(name).replace(/node_modules.+$/, `/node_modules/${name}`)
          const fromFile = pathJoin(packagePath, browserFilePath)
          const toFile = pathJoin(compiler.options.output.path || 'dist', url)
          cpfile.sync(fromFile, toFile)
          const fromFileMap = `${fromFile}.map`
          if (existsSync(fromFileMap)) {
            cpfile.sync(fromFileMap, `${toFile}.map`)
          }
        })
      } else {
        if (!unpkgHost) {
          throw new Error(`package ${name} missing host`)
        }
        url = fullPath || urlJoin(unpkgHost, `${name}@${version}`, browserFilePath)
      }
      return {
        url,
        version,
        attributes: pkg.attributes,
        injectBefore: pkg.injectBefore,
        injectAfter: pkg.injectAfter,
      }
    }
    const deps = this.options.packages.map(getBrowserFilePath)
    const tags = deps.reduce<TagObject[]>((r, d) => {
      const result: TagObject = d.url.endsWith('.css')
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
      if (d.injectBefore) {
        r.push(d.injectBefore)
      }
      r.push(result)
      if (d.injectAfter) {
        r.push(d.injectAfter)
      }
      return r
    }, [])

    compiler.hooks.compilation.tap(this.name, compilation => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tap(this.name, data => {
        /** remove repeat */
        const toPrependTags: any = []
        ;[...tags].reverse().forEach(tag => {
          const url = tag.tagName === 'script' ? tag.attributes.src : tag.attributes.href
          /**
           * 检查是否有重复加载的内容
           * 如果是script则对比src
           * 如果是link则对比href
           * */
          const exist = data.headTags.some(headTag => {
            if (headTag.tagName === 'script') {
              return Boolean(headTag.attributes.src) && headTag.attributes.src === url
            }
            if (headTag.tagName === 'link') {
              return headTag.attributes.href === url
            }
            return false
          })
          if (!exist) {
            data.headTags.unshift(tag as HtmlTagObject)
            toPrependTags.push(tag)
          }
        })

        console.log(chalk.rgb(73, 204, 144)(`[${this.name}] has prepend these resources in your html head:`))
        toPrependTags.forEach((tag: any) => {
          console.log(chalk.rgb(137, 191, 4)(JSON.stringify(tag)))
        })
        return data
      })
    })
  }
}
