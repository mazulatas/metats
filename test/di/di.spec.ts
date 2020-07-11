import { Inject, Injectable } from '../../src/di'

describe('DI', () => {
  it('should inject nested objects', () => {
    @Injectable()
    class TestClass1 {}

    @Injectable()
    class TestClass2 {
      @Inject(TestClass1) public testField: TestClass1
    }

    @Injectable()
    class TestClass3 {
      @Inject(TestClass2) public testField2: TestClass2
    }

    const instance = new TestClass3()
    expect(instance.testField2).toBeInstanceOf(TestClass2)
    expect(instance.testField2.testField).toBeInstanceOf(TestClass1)
  })

  it('should not inject', (done) => {
    class TestClass1 {}

    @Injectable()
    class TestClass2 {
      @Inject(TestClass1) public testField: TestClass1
    }
    const instance = new TestClass2()
    try {
      Reflect.get(instance, 'testField')
    } catch {
      done()
    }
  })

  it('should inject optional', () => {
    class TestClass1 {}

    @Injectable()
    class TestClass2 {
      @Inject({ token: TestClass1, optional: true }) public testField: TestClass1
    }
    const instance = new TestClass2()
    expect(instance.testField).toBeUndefined()
  })

  it('should inject single object', () => {
    @Injectable({ providedIn: 'root' })
    class TestClass1 {}

    @Injectable()
    class TestClass2 {
      @Inject(TestClass1) public testField: TestClass1
    }

    @Injectable()
    class TestClass3 {
      @Inject(TestClass1) public testField: TestClass1
    }

    const instance1 = new TestClass2()
    const instance2 = new TestClass3()
    expect(instance1.testField).toBe(instance2.testField)
  })

  it('should inject multi object', () => {
    @Injectable({ providedIn: 'root' })
    class TestClass1 {
    }

    @Injectable()
    class TestClass2 {
      @Inject(TestClass1) public testField1: TestClass1
    }

    @Injectable()
    class TestClass3 {
      @Inject({ token: TestClass1, injectOf: 'any' }) public testField1: TestClass1
    }

    const instanceClass2 = new TestClass2()
    const instanceClass3 = new TestClass3()
    expect(instanceClass2.testField1).not.toBe(instanceClass3.testField1)
  })

  it('should inject tree object', () => {
    let i = 0
    const getIndex = () => i++

    @Injectable({ providedIn: 'root' })
    class TestClass1 {
      public index = getIndex()
    }

    @Injectable()
    class TestClass2 {
      @Inject(TestClass1) public testField1: TestClass1
      public index = getIndex()
    }

    @Injectable()
    class TestClass3 {
      @Inject({ token: TestClass1, injectOf: 'any' }) public testField1: TestClass1
      @Inject(TestClass2) public testField2: TestClass2
      public index = getIndex()
    }

    const instanceClass2 = new TestClass2()
    const instanceClass3 = new TestClass3()
    const val1 = instanceClass2.testField1
    const val2 = instanceClass3.testField1
    const val3 = instanceClass3.testField2
    const val4 = val3.testField1
    expect(instanceClass2.testField1).not.toBe(instanceClass3.testField1)
  })
})
