import { Bean, Inject, Injector } from '../../../src/decorators'

describe('Inject', () => {
  it('should inject instance in class', () => {
    class InjectClass {}

    Injector.set({ provide: InjectClass })

    @Bean()
    class TestClass {
      @Inject(InjectClass) public testField?: InjectClass
    }

    const testInstance = new TestClass()
    expect(testInstance.testField).toBeInstanceOf(InjectClass)
  })
})
