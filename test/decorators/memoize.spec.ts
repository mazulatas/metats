import {Bean , Memoize} from '../../src'

describe('Memoize', () => {

  it('should memoize value', () => {
    let calls = 0
    @Bean()
    class TestClass {
      @Memoize()
      public init(q: number, w: number) {
        calls++
        return q + w
      }
    }

    const t = new TestClass()
    const r1 = t.init(1, 2)
    expect(calls).toEqual(1)
    const r2 = t.init(1, 2)
    expect(calls).toEqual(1)
    expect(r1).toEqual(r2)
    const r3 = t.init(1, 0)
    expect(calls).toEqual(2)
    expect(r3).not.toEqual(r1)
    expect(r3).not.toEqual(r2)
    expect(r3).toEqual(1)
  })

})
