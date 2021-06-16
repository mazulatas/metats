import { bootstrap } from '../../src'
import { Inject } from '../../src/di/inject'
import { Injectable } from '../../src/di/injectable'
import { Service } from '../../src/di/service'

describe('Bootstrap', () => {
  it('should test', () => {

    @Injectable()
    class TestClass2 {
      constructor(@Inject(() => TestClass1) public test: any) {
      }
    }

    @Injectable()
    class TestClass1 {
      constructor(@Inject(() => TestClass2) public test: any) {
      }
    }

    @Service({
      providers: [TestClass1, TestClass2]
    })
    class Main {
      constructor(@Inject(TestClass1) public test: any) {
      }
    }

    bootstrap([Main])
  })
})
