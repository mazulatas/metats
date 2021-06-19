import { Bean, getOriginalCtor, IType, makeConstructorDecorator, makeFieldDecorator, makeMethodDecorator,
  makeParamDecorator,
  MetaFactoryNoProps } from '../src'

describe('Meta', () => {

  describe('checking the integrity of the decoration', () => {
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
        testDecoratorAfterCallCtor1 = makeConstructorDecorator({handler: spy1, moment: 'afterCreateInstance'})
        testDecoratorAfterCallCtor2 = makeConstructorDecorator({handler: spy2, moment: 'afterCreateInstance'})
        testDecoratorBeforeCallCtor1 = makeConstructorDecorator({handler: spy3, moment: 'beforeCreateInstance'})
        testDecoratorBeforeCallCtor2 = makeConstructorDecorator({handler: spy4, moment: 'beforeCreateInstance'})
        testDecoratorDecorateCallCtor1 = makeConstructorDecorator({handler: spy5, moment: 'decorate'})
        testDecoratorDecorateCallCtor2 = makeConstructorDecorator({handler: spy6, moment: 'decorate'})
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
        expect(spy6).toHaveBeenCalled()
        expect(spy5).toHaveBeenCalled()
      })

      it('should decorate without side effects before create instance and after call constructor', () => {
        @testDecoratorAfterCallCtor1()
        @testDecoratorAfterCallCtor2()
        class TestClass {}
        const testInstance = new TestClass()
        expect(spy1).toHaveBeenCalled()
        expect(spy2).toHaveBeenCalled()
        expect(testInstance).toBeTruthy()
        expect(testInstance).toBeInstanceOf(TestClass)
      })

      it('should decorate without side effects before create instance and before call constructor', () => {
        @testDecoratorBeforeCallCtor1()
        @testDecoratorBeforeCallCtor2()
        class TestClass {}
        const testInstance = new TestClass()
        expect(spy3).toHaveBeenCalled()
        expect(spy4).toHaveBeenCalled()
        expect(testInstance).toBeTruthy()
        expect(testInstance).toBeInstanceOf(TestClass)
      })

      it('should decorate without side effects before and after call constructor', () => {
        @testDecoratorAfterCallCtor1()
        @testDecoratorBeforeCallCtor1()
        class TestClass {}
        const testInstance = new TestClass()
        expect(spy1).toHaveBeenCalled()
        expect(spy3).toHaveBeenCalled()
        expect(testInstance).toBeTruthy()
        expect(testInstance).toBeInstanceOf(TestClass)
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
        expect(testInstance).toBeInstanceOf(TestClass)
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
        expect(testInstance).toBeInstanceOf(TestClass)
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
        methodDecoratorAfterCallCtor1 = makeMethodDecorator({handler: spy1, moment: 'afterCreateInstance'})
        methodDecoratorAfterCallCtor2 = makeMethodDecorator({handler: spy2, moment: 'afterCreateInstance'})
        methodDecoratorBeforeCallCtor1 = makeMethodDecorator({handler: spy3, moment: 'beforeCreateInstance'})
        methodDecoratorBeforeCallCtor2 = makeMethodDecorator({handler: spy4, moment: 'beforeCreateInstance'})
        methodDecoratorDecorateCtor1 = makeMethodDecorator({handler: spy5, moment: 'decorate'})
        methodDecoratorDecorateCtor2 = makeMethodDecorator({handler: spy6, moment: 'decorate'})
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
        expect(testInstance).toBeInstanceOf(TestClass)
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
        expect(testInstance).toBeInstanceOf(TestClass)
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
        expect(testInstance).toBeInstanceOf(TestClass)
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
        expect(testInstance).toBeInstanceOf(TestClass)
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
        expect(testInstance).toBeInstanceOf(TestClass)
      })

    })

    describe('decorate field', () => {
      let fieldDecoratorDecorateCtor1: MetaFactoryNoProps
      let fieldDecoratorDecorateCtor2: MetaFactoryNoProps
      let fieldDecoratorAfterCallCtor1: MetaFactoryNoProps
      let fieldDecoratorAfterCallCtor2: MetaFactoryNoProps
      let fieldDecoratorBeforeCallCtor1: MetaFactoryNoProps
      let fieldDecoratorBeforeCallCtor2: MetaFactoryNoProps

      beforeEach(() => {
        fieldDecoratorAfterCallCtor1 = makeFieldDecorator({handler: spy1, moment: 'afterCreateInstance'})
        fieldDecoratorAfterCallCtor2 = makeFieldDecorator({handler: spy2, moment: 'afterCreateInstance'})
        fieldDecoratorBeforeCallCtor1 = makeFieldDecorator({handler: spy3, moment: 'beforeCreateInstance'})
        fieldDecoratorBeforeCallCtor2 = makeFieldDecorator({handler: spy4, moment: 'beforeCreateInstance'})
        fieldDecoratorDecorateCtor1 = makeFieldDecorator({handler: spy5, moment: 'decorate'})
        fieldDecoratorDecorateCtor2 = makeFieldDecorator({handler: spy6, moment: 'decorate'})
      })

      it('should decorate field after call ctor', () => {
        @Bean()
        class TestClass {
          @fieldDecoratorAfterCallCtor1()
          private field: any
        }
        const testInstance = new TestClass()
        expect(testInstance).toBeTruthy()
        expect(spy1).toHaveBeenCalled()
      })
    })

    describe('decorate param', () => {
      let paramDecoratorDecorateCtor1: MetaFactoryNoProps
      let paramDecoratorDecorateCtor2: MetaFactoryNoProps
      let paramDecoratorAfterCallCtor1: MetaFactoryNoProps
      let paramDecoratorAfterCallCtor2: MetaFactoryNoProps
      let paramDecoratorBeforeCallCtor1: MetaFactoryNoProps
      let paramDecoratorBeforeCallCtor2: MetaFactoryNoProps

      beforeEach(() => {
        paramDecoratorAfterCallCtor1 = makeParamDecorator({handler: spy1, moment: 'afterCreateInstance'})
        paramDecoratorAfterCallCtor2 = makeParamDecorator({handler: spy2, moment: 'afterCreateInstance'})
        paramDecoratorBeforeCallCtor1 = makeParamDecorator({handler: spy3, moment: 'beforeCreateInstance'})
        paramDecoratorBeforeCallCtor2 = makeParamDecorator({handler: spy4, moment: 'beforeCreateInstance'})
        paramDecoratorDecorateCtor1 = makeParamDecorator({handler: spy5, moment: 'decorate'})
        paramDecoratorDecorateCtor2 = makeParamDecorator({handler: spy6, moment: 'decorate'})
      })

      it('should decorate param after call ctor', () => {
        @Bean()
        class TestClass {
          constructor(@paramDecoratorAfterCallCtor1() private field: any) {}
        }
        const testInstance = new TestClass(1)
        expect(testInstance).toBeTruthy()
        expect(spy1).toHaveBeenCalled()
        expect(testInstance).toBeInstanceOf(TestClass)
      })
    })
  })

  describe('checking the execution of the decoration handler', () => {

    describe('decorate constructor', () => {

      it('should instantiate in decorator handler and compare with original', (done) => {
        let decoratorInstance: any

        function handler(ctx: IType<TestClass>) {
          decoratorInstance = new ctx()
        }

        const testCtorDecorator = makeConstructorDecorator({ moment: 'decorate', handler })

        @testCtorDecorator()
        class TestClass {}
        const testInstance = new TestClass()
        expect(testInstance).toEqual(decoratorInstance)
        expect(testInstance).toBeInstanceOf(TestClass)
        done()
      })

      it('should pass the constructor to the decorator handler before creating an instance', (done) => {

        function handler(ctx: IType<TestClass>) {
          const ctor = getOriginalCtor(TestClass)
          expect(ctor).toEqual(ctx)
          done()
        }

        const testCtorDecorator = makeConstructorDecorator({ moment: 'beforeCreateInstance', handler })

        @testCtorDecorator()
        class TestClass {}
        // tslint:disable-next-line:no-unused-expression
        new TestClass()
      })

      it('should pass the constructor to the decorator handler before creating an instance', (done) => {
        let decoratorInstance: any

        function handler(ctx: TestClass) {
          decoratorInstance = ctx
        }

        const testCtorDecorator = makeConstructorDecorator({ moment: 'afterCreateInstance', handler })

        @testCtorDecorator()
        class TestClass {}
        const testInstance = new TestClass()
        expect(testInstance).toEqual(decoratorInstance)
        expect(testInstance).toBeInstanceOf(TestClass)
        done()
      })

      it('must pass the decoration parameters to the constructor', (done) => {
        const testObj = { test: '123' }

        function handler(ctx: any, props: { test: string }) {
          expect(testObj).toEqual(props)
          expect(testObj.test).toEqual(props.test)
          done()
        }

        const testCtorDecorator = makeConstructorDecorator<{ test: string }>({ moment: 'decorate', handler })

        @testCtorDecorator(testObj)
        class TestClass {}
      })
    })

  })
})
