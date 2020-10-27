# webpack 插件

## HtmlWebpackLoadUnpkgScriptsPlugin

### 安装

```
yarn add html-webpack-load-unpkg-scripts-plugin
```

### 介绍

根据配置，将需要在应用运行之前加载的所有第三方库在 **运行时** ，提前注入到页面中，并在所有依赖载入完毕后执行应用。

### Example

```javascript
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

  // 每个外部包是否在载入后，使用带版本号的独立名称。考虑到多应用共同部署可能有不同版本冲突问题。
  // 默认为false，如果为true，则例如使用React 16.13.1版本
  // 全局React会被透明命名为 React16131，与其他依赖全局的React相区分。
  withVersionGlobalVarname?: boolean

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

    // 覆盖全局的withVersionGlobalVarname配置
    withVersionGlobalVarname?: boolean

    // 该选项应为带域名路径与其他所有url参数的万丈路径模式。
    // 当使用该选项时，host与path将被忽略，与当前项目package.json中依赖的版本绑定机制也将是小，该url将被直接使用作为script的src属性。
    // 例如: http://cdnjs.com/react/react.min.prodjction.js
    fullPath?: string
  }[]
}
```

### TODO

由于该插件修改了入口文件代码，但没有找到webpack重新生成`source map`的相关api，因此入口文件代码通过`source map`定位会有一行的偏差。待之后找到`source map`如何重新生成的方法之后再修正。
