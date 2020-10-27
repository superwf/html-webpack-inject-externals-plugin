import { isPlainObject, reduce } from 'lodash'
// import type { ExternalsObjectElement } from 'webpack'

import { isValidVarname } from './isValidVarname'
import { Externals } from './mergeExternals'

/**
 * 提取所有对象类型的externals配置
 * 返回{[k: packageName]: globalVarname}
 * */
export const extractExternalObject = (externals: Externals): Record<string, string> => {
  return externals.reduce<Record<string, string>>((result, extern) => {
    if (isPlainObject(extern)) {
      const externObj = reduce(
        extern as Record<string, any>,
        (r, v, k) => {
          /**
           * case:
           * 'moment': 'moment'
           * */
          if (typeof v === 'string' && isValidVarname(v)) {
            r[k] = v
          }

          /**
           * case:
           * lodash : {
           *   commonjs: 'lodash',
           *   amd: 'lodash',
           *   root: '_' // indicates global variable
           * },
           * */
          if (isPlainObject(v) && v.root) {
            r[k] = v.root
          }

          /**
           * case:
           * 'antd/lib/locales/zhCN': ['antd', 'locales', 'zh_CN'],
           * */
          if (Array.isArray(v) && v.length > 0 && isValidVarname(v[0])) {
            r[k] = v[0]!
          }
          return r
        },
        {} as Record<string, string>,
      )
      return {
        ...result,
        ...externObj,
      }
    }
    return result
  }, {})
}
