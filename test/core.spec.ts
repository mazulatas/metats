import { makeConstructorDecorator, makeMethodDecorator } from '../src/core/core'
import { Bean } from '../src/decorators'
import { MetaFactoryNoProps } from '../src/models/meta-factory'

describe('Meta', () => {
  let spy1: jasmine.Spy
  let spy2: jasmine.Spy
  let spy3: jasmine.Spy
  let spy4: jasmine.Spy
  let spy5: jasmine.Spy
  let spy6: jasmine.Spy

  beforeEach(() => {
    spy1 = jasmine.createSpy()
    spy2 = jasmine.createSpy()
    spy3 = jasmine.createSpy()
    spy4 = jasmine.createSpy()
    spy5 = jasmine.createSpy()
    spy6 = jasmine.createSpy()
  })

  describe('decorate constructor', () => {
    let testDecoratorAfterCallCtor1: MetaFactoryNoProps
    let testDecoratorAfterCallCtor2: MetaFactoryNoProps
    let testDecoratorBeforeCallCtor1: MetaFactoryNoProps
    let testDecoratorBeforeCallCtor2: MetaFactoryNoProps
    let testDecoratorDecorateCallCtor1: MetaFactoryNoProps
    let testDecoratorDecorateCallCtor2: MetaFactoryNoProps

    beforeEach(() => {
      testDecoratorAfterCallCtor1 = makeConstructorDecorator({handler: spy1, moment: {runtime: 'afterCreateInstance'}})
      testDecoratorAfterCallCtor2 = makeConstructorDecorator({handler: spy2, moment: {runtime: 'afterCreateInstance'}})
      testDecoratorBeforeCallCtor1 = makeConstructorDecorator({handler: spy3, moment: {runtime: 'beforeCreateInstance'}})
      testDecoratorBeforeCallCtor2 = makeConstructorDecorator({handler: spy4, moment: {runtime: 'beforeCreateInstance'}})
      testDecoratorDecorateCallCtor1 = makeConstructorDecorator({handler: spy5, moment: {runtime: 'decorate'}})
      testDecoratorDecorateCallCtor2 = makeConstructorDecorator({handler: spy6, moment: {runtime: 'decorate'}})
    })

    it('should decorate', () => {
      @testDecoratorDecorateCallCtor1()
      class TestClass {}
      expect(spy5).toHaveBeenCalled()
    })

    it('should decorate after create instance and after call constructor', () => {
      @testDecoratorAfterCallCtor1()
      class TestClass {}
      const testInstance = new TestClass()
      expect(spy1).toHaveBeenCalled()
      expect(testInstance).toBeTruthy()
    })

    it('should decorate after create instance and before call constructor', () => {
      @testDecoratorBeforeCallCtor1()
      class TestClass {}
      const testInstance = new TestClass()
      expect(spy3).toHaveBeenCalled()
      expect(testInstance).toBeTruthy()
    })

    it('should decorate without side effects before create instance', () => {
      @testDecoratorDecorateCallCtor1()
      @testDecoratorDecorateCallCtor2()
      class TestClass {}
      expect(spy5).toHaveBeenCalled()
      expect(spy6).toHaveBeenCalled()
    })

    it('should decorate without side effects before create instance and after call constructor', () => {
      @testDecoratorAfterCallCtor1()
      @testDecoratorAfterCallCtor2()
      class TestClass {}
      const testInstance = new TestClass()
      expect(spy1).toHaveBeenCalled()
      expect(spy2).toHaveBeenCalled()
      expect(testInstance).toBeTruthy()
    })

    it('should decorate without side effects before create instance and before call constructor', () => {
      @testDecoratorBeforeCallCtor1()
      @testDecoratorBeforeCallCtor2()
      class TestClass {}
      const testInstance = new TestClass()
      expect(spy3).toHaveBeenCalled()
      expect(spy4).toHaveBeenCalled()
      expect(testInstance).toBeTruthy()
    })

    it('should decorate without side effects before and after call constructor', () => {
      @testDecoratorAfterCallCtor1()
      @testDecoratorBeforeCallCtor1()
      class TestClass {}
      const testInstance = new TestClass()
      expect(spy1).toHaveBeenCalled()
      expect(spy3).toHaveBeenCalled()
      expect(testInstance).toBeTruthy()
    })

    it('should decorate without side effects before and after call constructor 2', () => {
      @testDecoratorAfterCallCtor1()
      @testDecoratorAfterCallCtor2()
      @testDecoratorBeforeCallCtor1()
      @testDecoratorBeforeCallCtor2()
      class TestClass {}
      const testInstance = new TestClass()
      expect(spy1).toHaveBeenCalled()
      expect(spy2).toHaveBeenCalled()
      expect(spy3).toHaveBeenCalled()
      expect(spy4).toHaveBeenCalled()
      expect(testInstance).toBeTruthy()
    })

    it('should decorate without side effects all', () => {
      @testDecoratorAfterCallCtor1()
      @testDecoratorAfterCallCtor2()
      @testDecoratorBeforeCallCtor1()
      @testDecoratorBeforeCallCtor2()
      @testDecoratorDecorateCallCtor1()
      @testDecoratorDecorateCallCtor2()
      class TestClass {}
      const testInstance = new TestClass()
      expect(spy1).toHaveBeenCalled()
      expect(spy2).toHaveBeenCalled()
      expect(spy3).toHaveBeenCalled()
      expect(spy4).toHaveBeenCalled()
      expect(spy5).toHaveBeenCalled()
      expect(spy6).toHaveBeenCalled()
      expect(testInstance).toBeTruthy()
    })
  })

  describe('decorate methods', () => {
    let methodDecoratorDecorateCtor1: MetaFactoryNoProps
    let methodDecoratorDecorateCtor2: MetaFactoryNoProps
    let methodDecoratorAfterCallCtor1: MetaFactoryNoProps
    let methodDecoratorAfterCallCtor2: MetaFactoryNoProps
    let methodDecoratorBeforeCallCtor1: MetaFactoryNoProps
    let methodDecoratorBeforeCallCtor2: MetaFactoryNoProps

    beforeEach(() => {
      methodDecoratorAfterCallCtor1 = makeMethodDecorator({handler: spy1, moment: {runtime: 'afterCreateInstance'}})
      methodDecoratorAfterCallCtor2 = makeMethodDecorator({handler: spy2, moment: {runtime: 'afterCreateInstance'}})
      methodDecoratorBeforeCallCtor1 = makeMethodDecorator({handler: spy3, moment: {runtime: 'beforeCreateInstance'}})
      methodDecoratorBeforeCallCtor2 = makeMethodDecorator({handler: spy4, moment: {runtime: 'beforeCreateInstance'}})
      methodDecoratorDecorateCtor1 = makeMethodDecorator({handler: spy5, moment: {runtime: 'decorate'}})
      methodDecoratorDecorateCtor2 = makeMethodDecorator({handler: spy6, moment: {runtime: 'decorate'}})
    })

    it('should decorate method after call ctor', () => {
      @Bean()
      class TestClass {
        @methodDecoratorAfterCallCtor1()
        public testMeth(): void {}
      }
      const testInstance = new TestClass()
      expect(testInstance).toBeTruthy()
      expect(spy1).toHaveBeenCalled()
    })

    it('should decorate method before call ctor', () => {
      @Bean()
      class TestClass {
        @methodDecoratorBeforeCallCtor1()
        public testMeth(): void {}
      }
      const testInstance = new TestClass()
      expect(testInstance).toBeTruthy()
      expect(spy3).toHaveBeenCalled()
    })

    it('should decorate method decorate ctor', () => {
      @Bean()
      class TestClass {
        @methodDecoratorDecorateCtor1()
        public testMeth(): void {}
      }
      const testInstance = new TestClass()
      expect(testInstance).toBeTruthy()
      expect(spy5).toHaveBeenCalled()
    })

    it('should decorate method without side effects all', () => {
      @Bean()
      class TestClass {
        @methodDecoratorAfterCallCtor1()
        @methodDecoratorAfterCallCtor2()
        @methodDecoratorBeforeCallCtor1()
        @methodDecoratorBeforeCallCtor2()
        @methodDecoratorDecorateCtor1()
        @methodDecoratorDecorateCtor2()
        public testMeth(): void {}
      }
      const testInstance = new TestClass()
      expect(testInstance).toBeTruthy()
      expect(spy1).toHaveBeenCalled()
      expect(spy2).toHaveBeenCalled()
      expect(spy3).toHaveBeenCalled()
      expect(spy4).toHaveBeenCalled()
      expect(spy5).toHaveBeenCalled()
      expect(spy6).toHaveBeenCalled()
    })

    it('should not mutate parameters after decoration', () => {
      const params: string = 'test'
      const returned: number = 123
      @Bean()
      class TestClass {
        @methodDecoratorAfterCallCtor1()
        @methodDecoratorAfterCallCtor2()
        @methodDecoratorBeforeCallCtor1()
        @methodDecoratorBeforeCallCtor2()
        @methodDecoratorDecorateCtor1()
        @methodDecoratorDecorateCtor2()
        public testMeth(props: string): number {
          expect(props).toEqual(params)
          return returned
        }
      }
      const testInstance = new TestClass()
      const testReturn = testInstance.testMeth(params)
      expect(testReturn).toEqual(returned)
    })

  })

})
