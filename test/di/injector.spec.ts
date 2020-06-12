import { InjectionToken, Injector } from '../../src/di'

describe('Injector', () => {
  it('should create instance', () => {
    class TestClass {
    }

    Injector.set({ provide: TestClass })

    const instance = Injector.get(TestClass)
    expect(instance).toBeInstanceOf(TestClass)
  })

  it('should create multiple instance', () => {
    class TestClass {
    }

    Injector.set({ provide: TestClass })

    const instance = Injector.get(TestClass)
    const instance1 = Injector.get(TestClass)
    expect(instance).not.toBe(instance1)
  })

  it('should create single instance', () => {
    class TestClass {
    }

    Injector.set({ provide: TestClass, providedIn: 'root' })

    const instance = Injector.get(TestClass)
    const instance1 = Injector.get(TestClass)
    expect(instance).toBe(instance1)
  })

  it('should replace implementation', () => {
    class TestClass1 {
    }

    class TestClass2 {
    }

    Injector.set({ provide: TestClass1, provideAs: TestClass2 })

    const instance = Injector.get(TestClass2)
    expect(instance).toBeInstanceOf(TestClass1)
  })

  it('should inject by injectToken', () => {
    class TestClass {
    }

    const token = InjectionToken.create('test token', TestClass)
    Injector.set({ provide: TestClass, provideAs: token })

    const instance = Injector.get(token)
    expect(instance).toBeInstanceOf(TestClass)
  })

  it('should create instance injector and inject', () => {
    const newInjector = Injector.create()
    class TestClass {
    }
    newInjector.set({ provide: TestClass })
    const instance = newInjector.get(TestClass)
    expect(instance).toBeInstanceOf(TestClass)
  })

  it('should create instance injector and inject from root injector', () => {
    const newInjector = Injector.create()
    class TestClass {
    }
    Injector.set({ provide: TestClass })
    const instance = newInjector.get(TestClass)
    expect(instance).toBeInstanceOf(TestClass)
  })

  it('should create instance injector and add instance class to root ', () => {
    const newInjector = Injector.create()
    class TestClass {
    }
    newInjector.set({ provide: TestClass, providedIn: 'root' })
    const instance = Injector.get(TestClass)
    expect(instance).toBeInstanceOf(TestClass)
  })
})
