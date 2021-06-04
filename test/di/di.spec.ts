import { Inject, Injectable, InjectField } from '../../src'

describe('DI', () => {
  it('should ddd', () => {
    @Injectable()
    class TestClass1 {
    }

    @Injectable()
    class TestClass2 {

      @InjectField(TestClass1) public testField: TestClass1
    }

    @Injectable()
    class TestClass3 {
      @InjectField(TestClass2) public testField2: TestClass2
    }

    const instance = new TestClass3()
    expect(instance.testField2).toBeInstanceOf(TestClass2)
    expect(instance.testField2.testField).toBeInstanceOf(TestClass1)
  })

  it('should deep inject', () => {

    @Injectable()
    class TestClass10 {
      public test = 'full'
    }

    @Injectable()
    class TestClass9 {
      constructor(@Inject(TestClass10) public test10: TestClass10) {
      }
    }

    @Injectable()
    class TestClass8 {
      constructor(@Inject(TestClass9) public test9: TestClass9) {
      }
    }

    @Injectable()
    class TestClass7 {
      constructor(@Inject(TestClass8) public test8: TestClass8) {
      }
    }

    @Injectable()
    class TestClass6 {
      constructor(@Inject(TestClass7) public test7: TestClass7) {
      }
    }

    @Injectable()
    class TestClass5 {
      constructor(@Inject(TestClass6) public test6: TestClass6) {
      }
    }

    @Injectable()
    class TestClass4 {
      constructor(@Inject(TestClass5) public test5: TestClass5) {
      }
    }

    @Injectable()
    class TestClass3 {
      constructor(@Inject(TestClass4) public test4: TestClass4) {
      }
    }

    @Injectable()
    class TestClass2 {
      constructor(@Inject(TestClass3) public test3: TestClass3) {
      }
    }

    @Injectable()
    class TestClass1 {
      constructor(@Inject(TestClass2) public test2: TestClass2) {
      }
    }
  })
})
