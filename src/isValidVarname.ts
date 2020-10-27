/** 判断字符串是否为合法变量名 */
export const isValidVarname = (name: string) => {
  return /^[a-z_$][0-9a-z_$]*?$/i.test(name)
}
