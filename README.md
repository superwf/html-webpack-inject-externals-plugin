# HtmlWebpackInjectExternalsPlugin

根据外部依赖配置，自动生成并插入script或link标签。

By configure externals packages settings, auto inject script or link tag into html template.

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
    // overwrite the global host
    host?: string

    // package name
    name: string

    // the correct script file path, as:
    // path: `/umd/react.${isProd ? 'production.min' : 'development'}.js`
    // optional
    path?: string

    // full url with protocol, host, and path。
    // 💡 when use `fullPath`, the `host` and `path` part will be ignored, this url will be used for the href of link tag, or src of script tag.
    // as: http://cdnjs.com/react/react.min.prodjction.js
    fullPath?: string

    // customize some attributes, as: { type: 'module', async: true }
    // optional
    attributes?: Record<string, string | boolean>
  }[]
}
```
