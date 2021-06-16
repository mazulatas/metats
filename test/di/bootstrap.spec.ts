import { bootstrap, Inject, Injectable, Injector } from '../../src'

describe('Bootstrap', () => {
  it('should test', () => {

    @Injectable()
    class TestClass2 {
    }

    @Injectable()
    class TestClass1 {
      constructor(@Inject(TestClass2) public test: any, @Inject(Injector) public injector: Injector) {

        expect(test).toBeInstanceOf(TestClass2)
        expect(injector).toBeInstanceOf(Injector)
      }
    }

    @Injectable({
      providers: [TestClass1, TestClass2]
    })
    class Main {
      constructor(@Inject(TestClass1) public test: any, @Inject(Injector) public injector: Injector) {
        expect(test).toBeInstanceOf(TestClass1)
        expect(injector).toBeInstanceOf(Injector)
      }
    }

    bootstrap([Main])
  })
})
