import {
  ContextType,
  FAKE_CTOR,
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
  MetaFactory,
  ORIGINAL_CTOR,
  stub
} from '../models'
import { IParamsDecoratorMaker } from '../models/core/params-decorator-maker'
import { IResolverContext } from '../models/core/resolver-context'
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

function propsAggregator<P, H extends IBaseHandler, R>(
  params: IParamsDecoratorMaker<H, P>[],
  type: ContextType,
  postCall: Function = stub
): MetaFactory<P, R> {
  return function(props?: P): any {
    return function(target: ICtor | IFakeCtor, ...args: any[]) {
      const resolver = getResolver(target)
      const context: IResolverContext[] = params.map(param => ({
        type,
        handler: param.handler,
        props: [param.propsMutator?.call(undefined, props) || props, ...args],
        resolve: false,
        moment: param?.moment || defaultHandlerCallMoment,
        name: param.name
      }))
      resolver.add(context)
      return postCall(target, resolver, ...args)
    }
  } as MetaFactory<P, R>
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
  function fakeCtor(...args: any[]): object {
    resolver.resolveBeforeCreateInstance(target)
    const instance = new target(...args)
    resolver.resolveAfterCreateInstance(instance)
    return instance
  }
  Reflect.set(fakeCtor, ORIGINAL_CTOR, target)
  Reflect.set(target, FAKE_CTOR, fakeCtor)
  fakeCtor.prototype = target.prototype
  return fakeCtor as IFakeCtor
}
