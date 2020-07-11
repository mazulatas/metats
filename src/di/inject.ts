import { makeFieldDecorator } from '..'
import { getOriginalCtor } from '../core/utils'
import { IInjectParameters } from '../models/di/inject-parameters'
import { Token } from '../models/di/token'
import { Injector } from './injector'

export const Inject = makeFieldDecorator<(Token<any> | IInjectParameters)>({ handler: injectHandler, moment: 'afterCreateInstance' })

function injectHandler(ctor: any, props: Token<any> | IInjectParameters, fieldName: string) {
  const innerProps = getParams(props)
  const originalCtor = getOriginalCtor(ctor)
  const descriptor = Reflect.getOwnPropertyDescriptor(originalCtor, fieldName) ||
    { enumerable: false, configurable: false }
  const cleanToken = getOriginalCtor(innerProps.token as any)
  let instance: any
  function customGetter() {
    try {
      if (!instance) instance = Injector.get(cleanToken, innerProps.injectOf)
    } catch (e) {
      if (!e.injectError) throw e
      if (!innerProps.optional) throw e
    }
    return instance
  }
  delete descriptor.writable
  delete descriptor.value
  Reflect.defineProperty(originalCtor, fieldName, {
    ...descriptor,
    get: customGetter
  })
}

function getParams(props: Token<any> | IInjectParameters): IInjectParameters {
  return Reflect.has(props, 'token') ? props as IInjectParameters : {
    token: props,
  }
}
