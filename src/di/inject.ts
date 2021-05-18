import { makeFieldDecorator } from '..'
import { getOriginalCtor } from '../core'
import { IInjectParameters, IType, Token } from '../models'
import { Injector } from './injector'

export const Inject = makeFieldDecorator<Token<any> | IInjectParameters>({ handler: injectHandler, moment: 'afterCreateInstance' })

function injectHandler(ctor: any, props: Token<any> | IInjectParameters, fieldName: string) {
  const originalCtor = getOriginalCtor(ctor)
  const descriptor = Reflect.getOwnPropertyDescriptor(originalCtor, fieldName) || { enumerable: false, configurable: false }
  if ((props as IInjectParameters).strategy === 'lazy') return injectLazyStrategy(originalCtor, descriptor, props, fieldName)
  return injectDefaultStrategy(originalCtor, descriptor, props, fieldName)
}

function injectDefaultStrategy(
  originalCtor: any,
  descriptor: PropertyDescriptor,
  props: Token<any> | IInjectParameters,
  fieldName: string
) {
  const token = (props as IInjectParameters).token || props
  const injectOf = (props as IInjectParameters).injectOf
  const injector = Injector.getInjector(token as IType<any>)
  const value = injector.get(token, injectOf)
  Reflect.defineProperty(originalCtor, fieldName, { ...descriptor, value })
}

function injectLazyStrategy(
  originalCtor: any,
  descriptor: PropertyDescriptor,
  props: Token<any> | IInjectParameters,
  fieldName: string
) {
  let value: any
  function customGetter() {
    if (value) return value
    const token = (props as IInjectParameters).token || props
    const injectOf = (props as IInjectParameters).injectOf
    const injector = Injector.getInjector(token as IType<any>)
    value = injector.get(token, injectOf)
    return value
  }
  delete descriptor.writable
  delete descriptor.value
  Reflect.defineProperty(originalCtor, fieldName, {
    ...descriptor,
    get: customGetter
  })
}
