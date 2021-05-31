import { makeParamDecorator } from '../core'
import { Token } from '../models'
import { Injector } from './injector'

export const Inject = makeParamDecorator<Token<any>>({ handler: handler, moment: 'decorate' })

function handler(ctor: any, token: Token<any>, methodName: string, index: number) {
  if (methodName) throw new Error('Inject only used for decorator parameters')
  const parentInjector = Injector.getInjector(ctor)
  const config = parentInjector.getConfig(ctor)
  if (!config) return
  if (!config.deps) config.deps = []
  config.deps[index] = (token)
}
