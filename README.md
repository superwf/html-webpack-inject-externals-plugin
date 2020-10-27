# auto inject your externals scripts and links to your html by webpack 

## HtmlWebpackInjectExternalsPlugin

### Install

```
yarn add html-webpack-inject-externals-plugin
```

### Intro

根据当前`package.json`依赖第三方库，将需要在应用运行之前加载的所有第三方库注入到html页面中。

目前支持依据加载路径的后缀名生成标签，`.css`生成`link`标签，其他的都生成script标签。

### Example

```javascript
const { HtmlWebpackInjectExternalsPlugin } from 'html-webpack-inject-externals-plugin'
const isProd = process.env.NODE_ENV === 'production'

  ...
  plugins: [
    new LoadExternalDependenciesWebpackPlugin({
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

### 使用方法

#### 在webpack配置文件中引入插件

##### Javascript

```javascript
import { LoadExternalDependenciesWebpackPlugin } from '@rmb/webpack-plugin'
```

##### Typescript

```typescript
import { LoadExternalDependenciesWebpackPlugin } from '@rmb/webpack-plugin/src/LoadExternalDependenciesWebpackPlugin'
```

##### 添加到plugins项

```javascript
  plugins: [
    ...,
    new LoadExternalDependenciesWebpackPlugin({
      externals: {
        history: 'History',
      },
      host: 'http://unpkg.jd.com',
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
  externals: {
    [packageName: string]: string | string[]
  }

  // 载入文件域名，例如https://unpkg.com
  host?: string

  // 每个外部依赖的单独配置数组
  packages: {
    // 覆盖全局的host配置
    host?: string

    // 包名称
    name: string

    // 包内文件路径，可自行根据env添加对应的文件。例如:
    // path: `/umd/react.${isProd ? 'production.min' : 'development'}.js`
    // 没有加载路径时可为空
    path?: string

    // 该选项应为带域名路径与其他所有url参数的万丈路径模式。
    // 当使用该选项时，host与path将被忽略，与当前项目package.json中依赖的版本绑定机制也将是小，该url将被直接使用作为script的src属性。
    // 例如: http://cdnjs.com/react/react.min.prodjction.js
    fullPath?: string

    // 一些自定义属性，例如script标签的 type: 'module'
    attributes?: Record<string, string>
  }[]
}
```
