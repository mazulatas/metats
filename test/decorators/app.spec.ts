import { App, bootstrap, cleanAppRoot } from '../../src'
import { stub } from '../../src/models/core/stub'

describe('App decorator', () => {

  afterEach(() => {
    cleanAppRoot()
  })

  it('should auto create instance', (done) => {
    const originalWarning = console.warn
    console.warn = stub
    @App()
    class TestApp {
      constructor() {
        console.warn = originalWarning
        done()
      }
    }
  })

  it('should auto call bootstrap', (done) => {
    @App()
    class TestApp {
      @bootstrap()
      private init() {
        done()
      }
    }
  })
})
