import {
  ContextType, FAKE_CTOR,
  HandlerCallMoment,
  IBaseHandler,
  IConstructorDecorationFunction,
  IConstructorHandler,
  ICtor,
  IFakeCtor,
  IFieldDecoratorFunction,
  IFieldHandler,
  IMethodDecoratorFunction,
  IMethodHandler,
  IParamDecoratorFunction,
  IParameterHandler,
  IResolver,
  MetaFactory, ORIGINAL_CTOR,
  stub
} from '../models'
import { IParamsDecoratorMaker } from '../models/core/params-decorator-maker'
import { IResolverContext } from '../models/core/resolver-context'
import { ArgumentsWrapper } from './arguments-wrapper'
import { checkFakeCtor, getResolver } from './utils'

const defaultHandlerCallMoment: HandlerCallMoment = 'decorate'

export function makeConstructorDecorator<P>(
  params: IParamsDecoratorMaker<IConstructorHandler<P>, P> | IParamsDecoratorMaker<IConstructorHandler<P>, P>[]
): MetaFactory<P, IConstructorDecorationFunction> {
  return propsAggregator(
    Array.isArray(params) ? params : [params],
    'ctor',
    getFakeCtx
  )
}

export function makeMethodDecorator<P>(
  params: IParamsDecoratorMaker<IMethodHandler<P>, P> | IParamsDecoratorMaker<IMethodHandler<P>, P>[]
): MetaFactory<P, IMethodDecoratorFunction> {
  return propsAggregator(
    Array.isArray(params) ? params : [params],
    'method'
  )
}

export function makeFieldDecorator<P>(
  params: IParamsDecoratorMaker<IFieldHandler<P>, P> | IParamsDecoratorMaker<IFieldHandler<P>, P>[],
  defaultDescriptor?: Partial<PropertyDescriptor>
): MetaFactory<P, IFieldDecoratorFunction> {
  return propsAggregator(
    Array.isArray(params) ? params : [params],
    'field',
    fieldDescriptor(defaultDescriptor)
  )
}

export function makeParamDecorator<P>(
  params: IParamsDecoratorMaker<IParameterHandler<P>, P> | IParamsDecoratorMaker<IParameterHandler<P>, P>[]
): MetaFactory<P, IParamDecoratorFunction> {
  return propsAggregator(
    Array.isArray(params) ? params : [params],
    'param'
  )
}

export function combineDecorators<P, F = IConstructorDecorationFunction>(decorators: MetaFactory<P, F>[]): MetaFactory<P, F>
export function combineDecorators<P, F = IMethodDecoratorFunction>(decorators: MetaFactory<P, F>[]): MetaFactory<P, F>
export function combineDecorators<P, F = IFieldDecoratorFunction>(decorators: MetaFactory<P, F>[]): MetaFactory<P, F>
export function combineDecorators<P, F = IParamDecoratorFunction>(decorators: MetaFactory<P, F>[]): MetaFactory<P, F>
export function combineDecorators(decorators: MetaFactory<any, any>[]): MetaFactory<any, any> {
  if (!decorators.every(decorator => decorator.type === decorators[0].type))
    throw new Error('combine decorators error: decorators of different types cannot be combined')
  const params = []
  const type = decorators[0].type
  for (let i = 0; i < decorators.length; i++) {
    const decorator = decorators[i]
    params.push(...decorator.params)
  }
  if (type === 'ctor') return makeConstructorDecorator(params)
  if (type === 'method') return makeMethodDecorator(params)
  if (type === 'field') return makeFieldDecorator(params)
  if (type === 'param') return makeParamDecorator(params)
  throw new Error(`combine decorators error: unknown type ${type}`)
}

function propsAggregator<P, H extends IBaseHandler, R>(
  params: IParamsDecoratorMaker<H, P>[],
  type: ContextType,
  postCall: Function = stub
): MetaFactory<P, R> {
  const handler = function(props?: P): any {
    return function(target: ICtor | IFakeCtor, ...args: any[]) {
      const resolver = getResolver(target)
      const context: IResolverContext[] = []
      for (let i = 0; i < params.length; i++) {
        const param = params[i]
        if (param.prohibitDuplicates && !param.name)
          console.warn('duplication check is performed based on its name, name is not specified', param)
        if (param.prohibitDuplicates && param.name && resolver.hasName(param.name)) throw new Error(`decorator duplication ${param.name} in ${target.name}`)
        context.push({
          type,
          handler: param.handler,
          props: [param.propsMutator?.call(undefined, props) || props, ...args],
          resolve: false,
          moment: param?.moment || defaultHandlerCallMoment,
          name: param.name
        })
      }
      resolver.add(context)
      return postCall(target, resolver, ...args)
    }
  } as MetaFactory<P, R>
  Reflect.set(handler, 'params', params)
  Reflect.set(handler, 'type', type)
  return handler
}

function fieldDescriptor(descriptor: Partial<PropertyDescriptor> = {}) {
  return function(target: any, _: any, fieldName: string) {
    const fieldDesc = Reflect.getOwnPropertyDescriptor(target, fieldName) || {}
    return { configurable: true, enumerable: true, writable: true, ...fieldDesc, ...descriptor }
  }
}

function getFakeCtx(target: ICtor | IFakeCtor, resolver: IResolver): IFakeCtor {
  resolver.resolveDecorationTime(target)
  if (checkFakeCtor(target)) return target as IFakeCtor
  const argsWrap = new ArgumentsWrapper()
  function fakeCtor(...args: any[]): object {
    resolver.resolveBeforeCreateInstance(target, argsWrap)
    const argv = argsWrap.arguments || args
    const instance = new target(...argv)
    argsWrap.arguments = argv
    resolver.resolveAfterCreateInstance(instance, argsWrap)
    return instance
  }
  const descriptor = Reflect.getOwnPropertyDescriptor(fakeCtor, 'name')
  Reflect.defineProperty(fakeCtor, 'name', { ...descriptor, value: (target.name + '_faceCtor') })
  Reflect.set(fakeCtor, ORIGINAL_CTOR, target)
  Reflect.set(target, FAKE_CTOR, fakeCtor)
  fakeCtor.prototype = target.prototype
  return fakeCtor as IFakeCtor
}
