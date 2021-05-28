import { Bean, Inject, InjectionToken, Injector } from '../../src'

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

  it('should inject object', () => {
    const testToken = InjectionToken.create('TestToken')
    const testToken1 = InjectionToken.create('TestToken1')
    const testObj = { test: 1 }
    Injector.set({ provide: () => (testObj), provideAs: testToken })
    Injector.set({ provide: (token) => token, provideAs: testToken1, deps: [ testToken ] })

    @Bean()
    class TestClass {
      @Inject(testToken1) public testField?: { test: number }
    }

    const testInstance = new TestClass()
    expect(testInstance.testField).toEqual(testObj)
  })
})
