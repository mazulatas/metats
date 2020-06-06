import { Injector } from '../../../src/decorators/di/injector'

describe('Injector', () => {
  it ('should create instance', () => {
    class TestClass {}

    Injector.set(TestClass)

    const instance = Injector.get(TestClass)
    expect(instance).toBeInstanceOf(TestClass)
  })

  it ('should create multiple instance', () => {
    class TestClass {}

    Injector.set(TestClass)

    const instance = Injector.get(TestClass)
    const instance1 = Injector.get(TestClass)
    expect(instance).not.toBe(instance1)
  })

  it ('should create single instance', () => {
    class TestClass {}

    Injector.set(TestClass, 'root')

    const instance = Injector.get(TestClass)
    const instance1 = Injector.get(TestClass)
    expect(instance).toBe(instance1)
  })
})
