/**
 * 生成变量与版本号的新合法变量名
 * */
export const generateVarnameWithVersion = (name: string, version: string) => {
  version = version.replace(/[^0-9a-z_$]/g, '')
  return `${name}${version}`
}
