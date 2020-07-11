import { Bean } from '../../src/decorators'
import { Inject, Injector } from '../../src/di'

describe('Inject', () => {
  it('should inject instance in class', () => {
    class InjectClass {}

    Injector.set({ provide: InjectClass })

    @Bean()
    class TestClass {
      @Inject(InjectClass) public testField: InjectClass
    }

    const testInstance = new TestClass()
    expect(testInstance.testField).toBeInstanceOf(InjectClass)
  })

  it('should inject optional instance in class', () => {
    class InjectClass {}

    @Bean()
    class TestClass {
      @Inject({ token: InjectClass, optional: true }) public testField: InjectClass
    }

    const testInstance = new TestClass()
    expect(testInstance.testField).toBeUndefined()
  })
})
