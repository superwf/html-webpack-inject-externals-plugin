import type { HtmlTagObject } from 'html-webpack-plugin'

/** 每个外部模块的加载配置 */
export type PackageOption = {
  host?: string
  name: string
  path?: string
  /**
   * 使用fullPath则完全使用该项，不再从模块的package.json中自动拼接路径
   * */
  fullPath?: string
  attributes?: Record<string, string | boolean>
  /**
   * 默认按path或fullPath中的后缀名判断，js为script，css为link
   * 没有后缀默认按script
   * 也可以使用该项指定，覆盖自动判断行为
   * */
  tagName?: string

  /**
   * 每个标签后面，可以自定义一个跟随的标签
   * 内容完全自定义
   * */
  afterInjectTag?: HtmlTagObject
}

/** 当前plugin的配置参数 */
export interface PluginOption {
  host?: string
  packages: PackageOption[]
  attributes?: Record<string, string | boolean>
}

export type PackageTagAttribute = {
  url: string
  version?: string
  attributes?: Record<string, string | boolean>
  afterInjectTag?: HtmlTagObject
}
