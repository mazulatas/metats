import { makeParamDecorator } from '../core'
import { IArgumentsWrapper, Token } from '../models'
import { Injector } from './injector'

export const Inject = makeParamDecorator<Token<any>>(
  { handler: handlerDecorate, moment: 'beforeCreateInstance', name: 'Inject' }
)

function handlerDecorate(ctx: any, props: Token<any>, methodName: string, index: number, args: IArgumentsWrapper) {
  if (methodName) throw new Error('Inject only used for decorator parameters')
  const injector = Injector.getInjector(ctx)
  if (!injector) throw new Error('Inject error: injector not exist')
  args.arguments[index] = injector.get(props)
}
