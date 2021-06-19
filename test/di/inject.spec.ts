import { Inject, Injectable, InjectionToken, Injector } from '../../src'

describe('Inject', () => {

  it('inject in constructor', () => {
    @Injectable()
    class InjectClass {
      public test = 1
    }
    Injector.root.set([InjectClass])

    @Injectable()
    class TestClass {
      constructor(@Inject(InjectClass) public field: InjectClass) {
      }
    }

    Injector.root.set([TestClass])
    const t = Injector.root.get(TestClass)
    expect(t.field.test).toEqual(1)
  })

  it('inject inject token in constructor', () => {
    @Injectable()
    class InjectClass {
      public test = 1
    }
    const testToken = InjectionToken.create('test token')
    Injector.root.set([{ useClass: InjectClass, token: testToken }])

    @Injectable()
    class TestClass {
      constructor(@Inject(testToken) public field: InjectClass) {
      }
    }

    Injector.root.set([TestClass])
    const t = Injector.root.get(TestClass)
    expect(t.field.test).toEqual(1)
  })

})
