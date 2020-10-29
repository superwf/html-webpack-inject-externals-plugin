# HtmlWebpackInjectExternalsPlugin

## 介绍

与`html-webpack-plugin`一起使用，将项目中的外部依赖自动按版本号生成script或link标签，注入html文件的header中。

目前支持依据加载路径的后缀名生成标签，`.css`生成`link`标签，其他的都生成script标签。

## 安装

```
yarn add html-webpack-inject-externals-plugin
```

## 示例代码

```javascript
const { HtmlWebpackInjectExternalsPlugin } from 'html-webpack-inject-externals-plugin'
const isProd = process.env.NODE_ENV === 'production'

  ...
  plugins: [
    new HtmlWebpackInjectExternalsPlugin({
      externals: {
        history: 'History',
      },
      host: 'http://unpkg.jd.com',
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

```html
开发环境:
<script src="http://unpkg.jd.com/history@4.10.1/umd/history.js"></script>
或生产环境
<script src="http://unpkg.jd.com/history@4.10.1/umd/history.min.js"></script>
```

其中的版本号以当前项目所依赖的版本号保持一致，且会将webpack入口脚本延迟加载到该脚本加载完毕后执行。

## 使用方法

### 在webpack配置文件中引入插件

#### Javascript

```javascript
const { HtmlWebpackInjectExternalsPlugin } = require('html-webpack-inject-externals-plugin')
```

#### Typescript

```typescript
import { HtmlWebpackInjectExternalsPlugin } from 'html-webpack-inject-externals-plugin'
```

#### 添加到plugins项

```javascript
  plugins: [
    ...,
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
          fullPath: 'http://unpkg.jd.com/animate.css@4.1.0/animate.css',
        },
      ],
    })
  ]
```

#### 参数解释

```
interface OPTION {
  // 参考webpack的externals的object格式配置，例如
  // react: 'React'
  // 'antd/lib/locale/zh_CN': ['antd', 'locales', 'zh_CN'],
  // 该配置会与webpack自身的externals配置合并。
  externals?: {
    [packageName: string]: string | string[]
  }

  // 载入unpkg的域名，例如https://unpkg.com
  host?: string

  // 每个外部依赖的单独配置数组
  packages: {
    // 覆盖上面全局的host配置
    host?: string

    // 包名称
    name: string

    // 包内文件路径，可自行根据env添加对应的文件。例如:
    // path: `/umd/react.${isProd ? 'production.min' : 'development'}.js`
    // 不需要加载路径时可为空
    path?: string

    // 该选项应为带域名、路径与其他所有url参数的完整路径模式。
    // 💡 当使用fullPath选项时，上面的host与path将被忽略，与当前项目package.json中依赖的版本绑定机制也将失效，该url将被直接使用作为script的src属性，或link的href属性。
    // 例如: http://cdnjs.com/react/react.min.prodjction.js
    fullPath?: string

    // 一些自定义标签属性，例如script标签的: attributes: { type: 'module', async: true }
    attributes?: Record<string, string | boolean>
  }[]
}
```
