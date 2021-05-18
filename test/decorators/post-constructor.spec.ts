import { Bean, PostConstructor } from '../../src'

describe('PostConstructor', () => {
  it('should call post constructor', (done) => {
    let testInstance: TestClass

    @Bean()
    class TestClass {
      @PostConstructor()
      private init() {
        expect(this).toEqual(testInstance)
        done()
      }
    }

    testInstance = new TestClass()
    expect(testInstance).toBeTruthy()
  })
})
