import { Inject, Injectable, InjectionToken, Injector } from '../../src'

describe('Inject', () => {

  it('inject in constructor', () => {
    class InjectClass {
      public test = 1
    }
    Injector.set({ provide: InjectClass })

    @Injectable()
    class TestClass {
      constructor(@Inject(InjectClass) public field: InjectClass) {
      }
    }

    const t = Injector.get(TestClass)
    expect(t.field.test).toEqual(1)
  })

  it('inject inject token in constructor', () => {
    class InjectClass {
      public test = 1
    }
    const testToken = InjectionToken.create('test token')
    Injector.set({ provide: InjectClass, provideAs: testToken })

    @Injectable()
    class TestClass {
      constructor(@Inject(testToken) public field: InjectClass) {
      }
    }

    const t = Injector.get(TestClass)
    expect(t.field.test).toEqual(1)
  })

})
