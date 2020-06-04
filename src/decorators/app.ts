import {
  makeConstructorDecorator,
  makeMethodDecorator,
} from '../core/core'
import { getGlobalThis } from '../core/utils'
import { APP_ROOT } from '../models/sumbols'

export const App = makeConstructorDecorator()
export const bootstrap = makeMethodDecorator()

function handlerDecoratorApp(ctx: any): void {
}

function handlerDecoratorBootstrap(sss: any, ddd: any, ff: any): void {
}

function setAppRoot(appRoot: object): void {
  const globalThis = getGlobalThis()
  if (Reflect.has(globalThis, APP_ROOT)) throw new Error('app root is init')
  Reflect.set(globalThis, APP_ROOT, appRoot)
}
