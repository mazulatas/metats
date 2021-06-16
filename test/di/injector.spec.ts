import { InjectionToken, Injector } from '../../src'

describe('Injector', () => {
  it('should create instance', () => {
    class TestClass {
    }

    Injector.root.set([TestClass])

    const instance = Injector.root.get(TestClass)
    expect(instance).toBeInstanceOf(TestClass)
  })

  it('should create multiple instance', () => {
    class TestClass {
    }

    Injector.root.set([{ token: TestClass, useClass: TestClass, isAny: true }])

    const instance = Injector.root.get(TestClass)
    const instance1 = Injector.root.get(TestClass)
    expect(instance).not.toBe(instance1)
  })

  it('should create single instance', () => {
    class TestClass {
    }

    Injector.root.set([TestClass])

    const instance = Injector.root.get(TestClass)
    const instance1 = Injector.root.get(TestClass)
    expect(instance).toBe(instance1)
  })

  it('should replace implementation', () => {
    class TestClass1 {
    }

    class TestClass2 {
    }

    Injector.root.set([{ token: TestClass2, useClass: TestClass1 }])

    const instance = Injector.root.get(TestClass2)
    expect(instance).toBeInstanceOf(TestClass1)
  })

  it('should inject by injectToken', () => {
    class TestClass {
    }

    const token = InjectionToken.create('test token')
    Injector.root.set([{ token: token, useClass: TestClass }])

    const instance = Injector.root.get(token)
    expect(instance).toBeInstanceOf(TestClass)
  })

  it('should create instance injector and inject', () => {
    const newInjector = Injector.create([], 'test_injector')
    class TestClass {
    }

    newInjector.set([TestClass])
    const instance = newInjector.get(TestClass)
    expect(instance).toBeInstanceOf(TestClass)
  })
})
