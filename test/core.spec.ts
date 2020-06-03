import { makeConstructorDecorator, makeMethodDecorator } from '../src/core/core'
import { Bean } from '../src/decorators'
import { IMetaNoProps, MomentCall } from '../src/models'

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
    let testDecoratorAfterCallCtor1: IMetaNoProps
    let testDecoratorAfterCallCtor2: IMetaNoProps
    let testDecoratorBeforeCallCtor1: IMetaNoProps
    let testDecoratorBeforeCallCtor2: IMetaNoProps
    let testDecoratorDecorateCallCtor1: IMetaNoProps
    let testDecoratorDecorateCallCtor2: IMetaNoProps

    beforeEach(() => {
      testDecoratorAfterCallCtor1 = makeConstructorDecorator(MomentCall.afterCallCtor, spy1)
      testDecoratorAfterCallCtor2 = makeConstructorDecorator(MomentCall.afterCallCtor, spy2)
      testDecoratorBeforeCallCtor1 = makeConstructorDecorator(MomentCall.beforeCallCtor, spy3)
      testDecoratorBeforeCallCtor2 = makeConstructorDecorator(MomentCall.beforeCallCtor, spy4)
      testDecoratorDecorateCallCtor1 = makeConstructorDecorator(MomentCall.decorate, spy5)
      testDecoratorDecorateCallCtor2 = makeConstructorDecorator(MomentCall.decorate, spy6)
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
    let methodDecoratorDecorateCtor1: IMetaNoProps
    let methodDecoratorDecorateCtor2: IMetaNoProps
    let methodDecoratorAfterCallCtor1: IMetaNoProps
    let methodDecoratorAfterCallCtor2: IMetaNoProps
    let methodDecoratorBeforeCallCtor1: IMetaNoProps
    let methodDecoratorBeforeCallCtor2: IMetaNoProps

    beforeEach(() => {
      methodDecoratorAfterCallCtor1 = makeMethodDecorator(MomentCall.afterCallCtor, spy1)
      methodDecoratorAfterCallCtor2 = makeMethodDecorator(MomentCall.afterCallCtor, spy2)
      methodDecoratorBeforeCallCtor1 = makeMethodDecorator(MomentCall.beforeCallCtor, spy3)
      methodDecoratorBeforeCallCtor2 = makeMethodDecorator(MomentCall.beforeCallCtor, spy4)
      methodDecoratorDecorateCtor1 = makeMethodDecorator(MomentCall.decorate, spy5)
      methodDecoratorDecorateCtor2 = makeMethodDecorator(MomentCall.decorate, spy6)
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
