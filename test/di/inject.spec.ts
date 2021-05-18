import { Bean } from '../../src'
import { Inject, Injector } from '../../src/di'

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

  it('should lazy inject instance in class', () => {
    class InjectClass {}
    Injector.set({ provide: InjectClass })

    @Bean()
    class TestClass {
      @Inject({ token: InjectClass, strategy: 'lazy' }) public testField?: InjectClass
    }

    const testInstance = new TestClass()
    const description = Reflect.getOwnPropertyDescriptor(testInstance, 'testField') as PropertyDescriptor
    expect(description.value).toBeUndefined()
    expect(typeof description.get).toEqual('function')
  })
})
