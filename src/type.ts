import type { HtmlTagObject } from 'html-webpack-plugin'

export type TagObject = Omit<HtmlTagObject, 'meta'> & {
  meta?: HtmlTagObject['meta']
}

/** 每个外部模块的加载配置 */
export type PackageOption = {
  /**
   * 如果有的包需要从其他站点或路径引入，
   * 可配置其他的类似unpkg功能的地址
   * 一般不需要单独配置
   * @example https://unpkg.my.com
   * */
  host?: string

  /**
   * 包名称
   * */
  name: string

  /**
   * 需要引用的包内的文件路径
   * @example `/umd/react.${isProd ? 'production.min' : 'development'}.js`
   */
  path?: string

  /**
   * 使用fullPath则完全使用该项，不再从模块的package.json中自动拼接路径
   * @example: http://cdnjs.com/react/react.min.prodjction.js
   * */
  fullPath?: string

  /**
   * 定制标签属性
   * */
  attributes?: Record<string, string | boolean>

  /**
   * 默认按path或fullPath中的后缀名判断，js为script，css为link
   * 没有后缀默认按script
   * 也可以使用该项指定，覆盖自动判断行为
   * */
  tagName?: string

  /**
   * 每个标签前面面，可以自定义一个跟随的标签
   * 内容完全自定义
   * */
  injectBefore?: TagObject

  /**
   * 每个标签后面，可以自定义一个跟随的标签
   * 内容完全自定义
   * 当使用有同名全局变量的包时可使用该属性将上一个全局变量改名
   * @example "if (window.$) { window.jQuery = window.$; delete window.$ }"
   * */
  injectAfter?: TagObject

  /**
   * 是否采用本地模式，即将node_modules中的文件复制到发布文件夹中
   * 使用了fullPath的package不会处理
   * */
  local?: boolean
}

/** 当前plugin的配置参数 */
export interface PluginOption {
  /**
   * unpkg站点
   * @example https://unpkg.com
   * */
  host?: string

  /**
   * 每个包的独立配置
   * */
  packages: PackageOption[]

  /**
   * 统一定制所有引入的标签的自定义属性
   * 如果注入多种标签比如有script和link，各个标签的attributes不能通用则不应使用该属性，在每个包中可单独定义attributes覆盖该属性。
   * */
  attributes?: Record<string, string | boolean>

  /**
   * 是否为本地部署
   * 本地部署模式将不在使用外部unpkg站点引入模块，而是将所有配置的模块文件copy到发布目录中。
   * 👁 @note 配置了fullPath的包不会受该属性影响
   * */
  local?: boolean
}

export type PackageTagAttribute = {
  url: string
  version?: string
  attributes?: Record<string, string | boolean>
  injectBefore?: TagObject
  injectAfter?: TagObject
}
