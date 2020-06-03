import { App } from '../../src/decorators'

describe('App decorator', () => {
  it('should auto create instance', () => {
    @App()
    class TestApp {}
  })
})
