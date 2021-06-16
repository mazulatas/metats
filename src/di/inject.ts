import { makeParamDecorator } from '../core'
import { IArgumentsWrapper, Token } from '../models'
import { Injector } from './injector'

export const Inject = makeParamDecorator<Token<any> | (() => Token<any>)>({ handler: handlerDecorate, moment: 'beforeCreateInstance' })

function handlerDecorate(ctx: any, props: Token<any> | (() => Token<any>), methodName: string, index: number, args: IArgumentsWrapper) {
  if (methodName) throw new Error('Inject only used for decorator parameters')
  const injector = Injector.getInjector(ctx)
  if (!injector) throw new Error('Inject error: injector not exist')
  let type
  if (typeof props === 'function') {
    try {
      type = (props as Function)()
    } catch (e) {
      console.error('Inject error: ', e)
    }
  } else type = props
  args.arguments[index] = injector.get(type)
}
