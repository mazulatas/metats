import { ContextType } from '../models/context-type'
import { ICtor } from '../models/ctor'
import { IFakeCtor } from '../models/fake-ctor'
import { IConstructorDecorationFunction, IMethodDecoratorFunction } from '../models/functions'
import { IBaseHandler, IConstructorHandler, IMethodHandler } from '../models/handlers'
import { MetaFactory } from '../models/meta-factory'
import { IParamsDecoratorMaker } from '../models/params-decorator-maker'
import { stub } from '../models/stub'
import { ORIGINAL_CTOR, RESOLVER } from '../models/sumbols'
import { Resolver } from './resolver'

const depthGlobal = 3

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
    ctorFactory
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
    factory.bind(undefined, 'method')
  )
}

function propsAggregator<P, H extends IBaseHandler<P>, R>(params: IParamsDecoratorMaker<H, P>[], factory: Function): MetaFactory<P, R> {
  return function(props?: P): any {
    if (props) {
      params.forEach(param => {
        const originalMutator = param.propsMutator || stub
        param.propsMutator = () => originalMutator(props)
      })
    }
    return function(target: R, ...args: any[]) {
      params.forEach(param => {
        const originalHandler = param.handler
        param.handler = ((target: object, props: P) => originalHandler(target, props, ...args)) as H
      })
      return factory(target, params, ...args)
    }
  } as MetaFactory<P, R>
}

function ctorFactory<P>(target: ICtor | IFakeCtor, params: IParamsDecoratorMaker<IConstructorHandler<P>, P>[]): IFakeCtor {
  const resolver = getResolver(target)
  resolver.add(params, 'ctor')
  return getFakeCtx(target, resolver)
}

function factory<P>(type: ContextType, target: ICtor | IFakeCtor, params: IParamsDecoratorMaker<IConstructorHandler<P>, P>[]): void {
  const resolver = getResolver(target)
  resolver.add(params, type)
}

function getFakeCtx(target: ICtor | IFakeCtor, resolver: Resolver): IFakeCtor {
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

export function getResolver(ctor: ICtor | IFakeCtor): Resolver {
  const originalCtor = getOriginalCtor(ctor)
  if (hasDeepField(originalCtor, RESOLVER)) return getDeepField(originalCtor, RESOLVER)
  Reflect.set(originalCtor, RESOLVER, new Resolver())
  return Reflect.get(originalCtor, RESOLVER)
}
