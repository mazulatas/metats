import { ContextType } from '../models/context-type'
import { ICtor } from '../models/ctor'
import { IFakeCtor } from '../models/fake-ctor'
import { IConstructorDecorationFunction, IFieldDecoratorFunction, IMethodDecoratorFunction } from '../models/functions'
import { HandlerCallMoment } from '../models/handler-call-moment'
import { IBaseHandler, IConstructorHandler, IMethodHandler } from '../models/handlers'
import { MetaFactory } from '../models/meta-factory'
import { IParamsDecoratorMaker } from '../models/params-decorator-maker'
import { IResolver } from '../models/resolver'
import { IResolverContext } from '../models/resolver-context'
import { stub } from '../models/stub'
import { FAKE_CTOR, ORIGINAL_CTOR } from '../models/sumbols'
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
  params: IParamsDecoratorMaker<IMethodHandler<P>, P> | IParamsDecoratorMaker<IMethodHandler<P>, P>[]
): MetaFactory<P, IFieldDecoratorFunction> {
  return propsAggregator(
    Array.isArray(params) ? params : [params],
    'field'
  )
}

function propsAggregator<P, H extends IBaseHandler, R>(
  params: IParamsDecoratorMaker<H, P>[],
  type: ContextType,
  postCall: Function = stub
): MetaFactory<P, R> {
  return function(props?: P): any {
    if (props) {
      params.forEach(param => {
        const originalMutator = param.propsMutator || stub
        param.propsMutator = () => originalMutator(props)
      })
    }
    return function(target: ICtor | IFakeCtor, ...args: any[]) {
      const resolver = getResolver(target)
      const context: IResolverContext[] = params.map(param => ({
        type,
        handler: param.handler,
        props: [param.propsMutator?.call(undefined, props), ...args],
        resolve: false,
        moment: param?.moment || defaultHandlerCallMoment,
        name: param.name
      }))
      resolver.add(context)
      return postCall(target, resolver)
    }
  } as MetaFactory<P, R>
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
