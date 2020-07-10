import { makeFieldDecorator } from '..'
import { getOriginalCtor } from '../core/utils'
import { IInjectParameters } from '../models/di/inject-parameters'
import { Token } from '../models/di/token'
import { Injector } from './injector'

export const Inject = makeFieldDecorator<(Token<any> | IInjectParameters)>({ handler: injectHandler, moment: 'afterCreateInstance' })

function injectHandler(ctor: any, props: Token<any> | IInjectParameters, fieldName: string) {
  const originalCtor = getOriginalCtor(ctor)
  const descriptor = Reflect.getOwnPropertyDescriptor(originalCtor, fieldName) ||
    { enumerable: false, configurable: false }
  function customGetter() {
    const token = (props as IInjectParameters).token || props
    const injectOf = (props as IInjectParameters).injectOf
    return Injector.get(token, injectOf)
  }
  delete descriptor.writable
  delete descriptor.value
  Reflect.defineProperty(originalCtor, fieldName, {
    ...descriptor,
    get: customGetter
  })
}
