# HtmlWebpackInjectExternalsPlugin

根据外部依赖配置，自动生成并插入script或link标签。

By configure externals packages settings, auto inject script or link tag into html template.

## Notice

仅支持webpack > 5

Only works with webpack 5 and html-webpack-plugin 5.

To work with webpack 4, try `https://github.com/shirotech/webpack-cdn-plugin`.

## 介绍 / Intro

与`html-webpack-plugin`一起使用，将项目中的外部依赖自动按版本号生成script或link标签，注入html文件的header中。

目前支持依据加载路径的后缀名生成标签，`.css`生成`link`标签，其他的都生成script标签。

Work together with `html-webpack-plugin`, get your project dependencies correct version to generate script or link tag, then inject them into your html template header.

For now only support suffix with `.css` for `link` tag, all other suffixes will be `script` tags.

## 安装 / Install

```
yarn add html-webpack-inject-externals-plugin
```

## 配置示例代码 / Config example

```javascript
const { HtmlWebpackInjectExternalsPlugin } from 'html-webpack-inject-externals-plugin'
const isProd = process.env.NODE_ENV === 'production'

  ...
  plugins: [
    new HtmlWebpackInjectExternalsPlugin({
      externals: {
        history: 'History',
      },
      host: 'https://unpkg.com',
      packages: [
        {
          name: 'history',
          path: `/umd/history.${isProd ? 'min.' : ''}js`,
        },
      ],
    })
  ]
```

以上配置可生成script标签并插入document.head，如下

Above config will generate result like:

```html
<!--开发环境/development env -->
<script src="https://unpkg.com/history@4.10.1/umd/history.js"></script>
<!--生产环境/production env -->
<script src="https://unpkg.com/history@4.10.1/umd/history.min.js"></script>
```

其中的版本号以当前项目所依赖的版本号保持一致。

The `version` part will be your project real dependencies version.

## 使用方法 / Usage

### 在webpack配置文件中引入插件

* 💡 必须与`html-webpack-plugin`一起使用。

    Must work with `html-webpack-plugin` together.

* 💡 `html-webpack-plugin`版本需要 `> 4`。

    Require `html-webpack-plugin` version `>4`.

* 🍾 兼容`webpack 5`，在`next`分支上测试。

    Compatible with `webpack 5`, tested in `next` branch.

#### Javascript

```javascript
const { HtmlWebpackInjectExternalsPlugin } = require('html-webpack-inject-externals-plugin')
```

#### Typescript

```typescript
import { HtmlWebpackInjectExternalsPlugin } from 'html-webpack-inject-externals-plugin'
```

#### 添加到plugins项 / add to plugins

```javascript
  plugins: [
    ...,
    new HtmlWebpackPlugin({
      inject: true,
      template: './public/index.html',
    }),
    new HtmlWebpackInjectExternalsPlugin({
      // externals项，非必须，可以写在这里，也可以直接写在webpack的externals中。
      externals: {
        history: 'History',
      },
      host: 'https://unpkg.com',
      packages: [
        {
          name: 'history',
          path: '/umd/history.js',
        },
        {
          name: 'animate.css',
          fullPath: 'https://unpkg.com/animate.css@4.1.0/animate.css',
        },
      ],
    })
  ]
```

#### 参数解释 / Config Option

```
interface OPTION {
  // same with webpack externals. as below:
  // {
  //   react: 'React'
  //   'antd/lib/locale/zh_CN': ['antd', 'locales', 'zh_CN'],
  // }
  // this is optional, set it at webpack config part, works the same way.
  externals?: {
    [packageName: string]: string | string[]
  }

  // full host with protocol, like "https://unpkg.com"
  host?: string

  // your externals dependencies
  packages: {
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
    injectBefore?: HtmlTagObject

    /**
     * 每个标签后面，可以自定义一个跟随的标签
     * 内容完全自定义
     * */
    injectAfter?: HtmlTagObject

    /**
     * 是否采用本地模式，即将node_modules中的文件复制到发布文件夹中
     * 使用了fullPath的package不会处理
     * */
    local?: boolean

    /**
     * 本地模式配合使用的文件夹前缀
     * 例如 /assets 或 /static
     * */
    localPrefix?: string
  }[]
}
```
