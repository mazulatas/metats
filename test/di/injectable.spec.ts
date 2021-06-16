import { Injectable } from '../../src/di/injectable'

describe('Injectable', () => {

  it('', () => {
    @Injectable()
    class TestClass {

    }
  })

  // it('should replace injectable implementation use token', () => {
  //   const token = InjectionToken.create('test')
  //
  //   @Injectable({ provideAs: token })
  //   class TestClass3 {
  //   }
  //
  //   const instance = Injector.get(token)
  //   expect(instance).toBeInstanceOf(TestClass3)
  // })
  //
  // it('should replace injectable implementation', () => {
  //   class TestClass1 {
  //   }
  //
  //   @Injectable({ provideAs: TestClass1 })
  //   class TestClass2 {
  //   }
  //
  //   const instance = Injector.get(TestClass1)
  //   expect(instance).toBeInstanceOf(TestClass2)
  // })
  //
  // it('should create injectable instance', () => {
  //   @Injectable()
  //   class TestClass4 {
  //   }
  //
  //   const instance = Injector.get(TestClass4)
  //   expect(instance).toBeInstanceOf(TestClass4)
  // })
  //
  // it('should multiply create injectable Instance', () => {
  //   @Injectable()
  //   class TestClass5 {
  //   }
  //
  //   const instance = Injector.get(TestClass5)
  //   const instance1 = Injector.get(TestClass5)
  //   expect(instance).not.toBe(instance1)
  // })
  //
  // it('should create single injectable Instance', () => {
  //   @Injectable({ providedIn: 'root' })
  //   class TestClass6 {
  //   }
  //
  //   const instance = Injector.get(TestClass6)
  //   const instance1 = Injector.get(TestClass6)
  //   expect(instance).toBe(instance1)
  // })
})
