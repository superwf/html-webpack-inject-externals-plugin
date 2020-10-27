import { isValidVarname } from '../src/isValidVarname'

describe('isValidVarname', () => {
  it('valid cases', () => {
    expect(isValidVarname('abc')).toBe(true)
    expect(isValidVarname('abc11')).toBe(true)
    expect(isValidVarname('A_1c11')).toBe(true)
    expect(isValidVarname('_A1c11')).toBe(true)
    expect(isValidVarname('$_A1c11')).toBe(true)
    expect(isValidVarname('_A1c11$')).toBe(true)
    expect(isValidVarname('_')).toBe(true)
    expect(isValidVarname('d')).toBe(true)
    expect(isValidVarname('$')).toBe(true)
  })

  it('invalid cases', () => {
    expect(isValidVarname(' abc')).toBe(false)
    expect(isValidVarname('1abc11')).toBe(false)
    expect(isValidVarname(' ')).toBe(false)
    expect(isValidVarname('&')).toBe(false)
    expect(isValidVarname('acc-sdfsfd')).toBe(false)
    expect(isValidVarname('abc11 ')).toBe(false)
    expect(isValidVarname('A_1c 11')).toBe(false)
    expect(isValidVarname('commonjs _A1c11')).toBe(false)
  })
})
