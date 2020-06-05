import { App, bootstrap } from '../../src/decorators'

describe('App decorator', () => {
  it('should auto create instance', (done) => {
    @App()
    class TestApp {
      constructor() {
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
