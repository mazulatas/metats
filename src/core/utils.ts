import {
  FAKE_CTOR,
  IBaseHandler,
  ICtor,
  IFakeCtor,
  IResolver,
  ORIGINAL_CTOR,
  RESOLVER
} from '../models'
import { Resolver } from './resolver'

const depthGlobal = 3

export function checkDecorated(cls: IFakeCtor | ICtor): boolean {
  return hasDeepField(cls, ORIGINAL_CTOR) || hasDeepField(cls, FAKE_CTOR)
}

export function checkFakeCtor(cls: IFakeCtor | ICtor): boolean {
  return hasDeepField(cls, ORIGINAL_CTOR)
}

export function getOriginalCtor(ctor: any): any
export function getOriginalCtor<T>(ctor: any): T
export function getOriginalCtor(ctor: IFakeCtor | ICtor): ICtor {
  return checkFakeCtor(ctor) ? getDeepField(ctor, ORIGINAL_CTOR) : ctor
}

export function getFakeCtor(ctor: IFakeCtor | ICtor): IFakeCtor {
  return checkFakeCtor(ctor) ? ctor as IFakeCtor : getDeepField(ctor, FAKE_CTOR)
}

export function hasDeepField(cls: IFakeCtor | ICtor | any, name: string | symbol, depth = 0): boolean {
  if (!cls) return false
  if (depth > depthGlobal) return false
  return Reflect.has(cls, name) || hasDeepField(cls.prototype, name, depth + 1)
}

export function getDeepField<R>(cls: IFakeCtor | ICtor | any, name: string | symbol, depth = 0): R {
  if (depth > depthGlobal) throw new Error(`could not find ${name.toString()}`)
  return Reflect.has(cls, name) ? Reflect.get(cls, name) : getDeepField(cls.prototype, name, depth + 1)
}

export function getResolver(ctor: ICtor | IFakeCtor): IResolver {
  const originalCtor = getOriginalCtor(ctor)
  if (hasDeepField(originalCtor, RESOLVER)) return getDeepField(originalCtor, RESOLVER)
  Reflect.set(originalCtor, RESOLVER, new Resolver())
  return Reflect.get(originalCtor, RESOLVER)
}

export function asyncHandler(handler: IBaseHandler): IBaseHandler {
  return function(target: object, ...args: any[]) {
    return Promise.resolve().then(() => handler(target, ...args))
  }
}

export function callMethod(context: any, methodName: string): void {
  const method: Function = context[methodName]
  method.apply(context)
}
