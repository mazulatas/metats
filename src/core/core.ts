import { ContextType } from '../models/context-type'
import { ICtor } from '../models/ctor'
import { IFakeCtor } from '../models/fake-ctor'
import { IConstructorDecorationFunction, IMethodDecoratorFunction } from '../models/functions'
import { HandlerCallMoment } from '../models/handler-call-moment'
import { IBaseHandler, IConstructorHandler, IMethodHandler } from '../models/handlers'
import { MetaFactory } from '../models/meta-factory'
import { IParamsDecoratorMaker } from '../models/params-decorator-maker'
import { IResolver } from '../models/resolver'
import { IResolverContext } from '../models/resolver-context'
import { stub } from '../models/stub'
import { ORIGINAL_CTOR, RESOLVER } from '../models/sumbols'
import { Resolver } from './resolver'

const depthGlobal = 3

const defaultHandlerCallMoment: HandlerCallMoment = 'decorate'

export function makeConstructorDecorator<P>(
  params: IParamsDecoratorMaker<IConstructorHandler<P>, P>
): MetaFactory<P, IConstructorDecorationFunction>

export function makeConstructorDecorator<P>(
  ...params: IParamsDecoratorMaker<IConstructorHandler<P>, P>[]
): MetaFactory<P, IConstructorDecorationFunction>

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
  params: IParamsDecoratorMaker<IMethodHandler<P>, P>
): MetaFactory<P, IMethodDecoratorFunction>

export function makeMethodDecorator<P>(
  ...params: IParamsDecoratorMaker<IMethodHandler<P>, P>[]
): MetaFactory<P, IMethodDecoratorFunction>

export function makeMethodDecorator<P>(
  params: IParamsDecoratorMaker<IMethodHandler<P>, P> | IParamsDecoratorMaker<IMethodHandler<P>, P>[]
): MetaFactory<P, IMethodDecoratorFunction> {
  return propsAggregator(
    Array.isArray(params) ? params : [params],
    'method'
  )
}

function propsAggregator<P, H extends IBaseHandler<P>, R>(
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
  const fakeCtor = function(...args: any[]): object {
    resolver.resolveBeforeCreateInstance(target)
    const instance = new target(...args)
    resolver.resolveAfterCreateInstance(instance)
    return instance
  } as IFakeCtor
  Reflect.set(fakeCtor, ORIGINAL_CTOR, target)
  fakeCtor.prototype = target.prototype
  return fakeCtor
}

function checkFakeCtor(cls: IFakeCtor | ICtor): boolean {
  return hasDeepField(cls, ORIGINAL_CTOR)
}

function getOriginalCtor(cls: IFakeCtor | ICtor): ICtor {
  return checkFakeCtor(cls) ? getDeepField(cls, ORIGINAL_CTOR) : cls
}

function hasDeepField(cls: IFakeCtor | ICtor, name: string | symbol, depth = 0): boolean {
  if (!cls) return false
  if (depth > depthGlobal) return false
  return Reflect.has(cls, name) || hasDeepField(cls.prototype, name, +1)
}

function getDeepField<R>(cls: IFakeCtor | ICtor, name: string | symbol, depth = 0): R {
  if (depth > depthGlobal) throw new Error(`could not find ${name.toString()}`)
  return Reflect.has(cls, name) ? Reflect.get(cls, name) : getDeepField(cls.prototype, name, depth + 1)
}

export function getResolver(ctor: ICtor | IFakeCtor): IResolver {
  const originalCtor = getOriginalCtor(ctor)
  if (hasDeepField(originalCtor, RESOLVER)) return getDeepField(originalCtor, RESOLVER)
  Reflect.set(originalCtor, RESOLVER, new Resolver())
  return Reflect.get(originalCtor, RESOLVER)
}
