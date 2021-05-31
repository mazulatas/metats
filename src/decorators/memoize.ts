import { makeMethodDecorator } from '../core'
import { equalsArray } from '../utils/equals-data'

export const Memoize = makeMethodDecorator({ handler, moment: 'decorate' })

function handler(ctx: any, _: any, methodName: string) {
  const descriptor = Reflect.getOwnPropertyDescriptor(ctx.prototype, methodName) || {}
  const originalFn = descriptor.value
  let lastArgs: any[]
  let lastResult: any
  function memoizeFn() {
    try {
      if (equalsArray(arguments as any, lastArgs)) return lastResult
      lastArgs = arguments as any
      // @ts-ignore
      lastResult = originalFn.apply(this, arguments)
      return lastResult
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log('error in memoize function', originalFn.name, e)
      return undefined
    }
  }
  Reflect.defineProperty(ctx.prototype, methodName, { ...descriptor, value: memoizeFn })
}
