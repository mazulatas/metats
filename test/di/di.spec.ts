import { Injectable, InjectField } from '../../src'

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
})
