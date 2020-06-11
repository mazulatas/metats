import {
  makeConstructorDecorator,
  makeMethodDecorator,
} from '../core/core'
import { asyncHandler, callMethod, getFakeCtor, getGlobalThis, getResolver } from '../core/utils'
import { APP_ROOT } from '../models/core/sumbols'

export const App = makeConstructorDecorator({ handler: asyncHandler(handlerDecoratorAppInstanceCreator), moment: 'decorate' })
export const bootstrap = makeMethodDecorator({ handler: handlerDecoratorBootstrap, moment: 'afterCreateInstance', name: 'bootstrap' })

function handlerDecoratorAppInstanceCreator(ctor: any): void {
  const resolver = getResolver(ctor)
  const fCtor = getFakeCtor(ctor)
  if (!resolver.hasName('bootstrap')) {
    console.warn('not found bootstrap method')
  }
  const instance = new fCtor()
  setAppRoot(instance)
}

function handlerDecoratorBootstrap(target: any, _: any, methodName: string): void {
  callMethod(target, methodName)
}

function setAppRoot(appRoot: object): void {
  const globalContext = getGlobalThis()
  if (Reflect.get(globalContext, APP_ROOT)) throw new Error('app root is init')
  Reflect.set(globalContext, APP_ROOT, appRoot)
}

export function cleanAppRoot() {
  const globalContext = getGlobalThis()
  Reflect.set(globalContext, APP_ROOT, undefined)
}
