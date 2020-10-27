import type { Configuration } from 'webpack'

type Externals = Configuration['externals']

/**
 * 合并webpack config externals配置
 * 返回数组化配置
 * */
export const mergeExternals = (externals1: Externals, externals2?: Externals): Externals => {
  const externals3: Externals = []
  if (externals1) {
    if (Array.isArray(externals1)) {
      externals3.push(...externals1)
    } else {
      externals3.push(externals1)
    }
  }
  if (externals2) {
    if (Array.isArray(externals2)) {
      externals3.push(...externals2)
    } else {
      externals3.push(externals2)
    }
  }
  return externals3
}
