import { makeFieldDecorator } from '..'
import { getOriginalCtor } from '../core'
import { IType } from '../models/core/type'
import { IInjectParameters } from '../models/di/inject-parameters'
import { Token } from '../models/di/token'
import { Injector } from './injector'

export const Inject = makeFieldDecorator<Token<any> | IInjectParameters>({ handler: injectHandler, moment: 'afterCreateInstance' })

function injectHandler2(ctor: any, props: Token<any> | IInjectParameters, fieldName: string) {
  const originalCtor = getOriginalCtor(ctor)
  const descriptor = Reflect.getOwnPropertyDescriptor(originalCtor, fieldName) || { enumerable: false, configurable: false }
  function customGetter() {
    const token = (props as IInjectParameters).token || props
    const injectOf = (props as IInjectParameters).injectOf
    const injector = Injector.getInjector(token as IType<any>)
    return injector.get(token, injectOf)
  }
  delete descriptor.writable
  delete descriptor.value
  Reflect.defineProperty(originalCtor, fieldName, {
    ...descriptor,
    get: customGetter
  })
}

function injectHandler(ctor: any, props: Token<any> | IInjectParameters, fieldName: string) {
  const originalCtor = getOriginalCtor(ctor)
  const descriptor = Reflect.getOwnPropertyDescriptor(originalCtor, fieldName) || { enumerable: false, configurable: false }
  const token = (props as IInjectParameters).token || props
  const injectOf = (props as IInjectParameters).injectOf
  const injector = Injector.getInjector(token as IType<any>)
  const value = injector.get(token, injectOf)
  Reflect.defineProperty(originalCtor, fieldName, { ...descriptor, value })
}
