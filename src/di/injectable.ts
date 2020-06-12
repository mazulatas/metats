import { makeConstructorDecorator } from '..'
import { getOriginalCtor } from '../core/utils'
import { IType } from '../models/core/type'
import { IInjectableParameters } from '../models/di/injectable-parameters'
import { defaultInjectorConfig, Injector } from './injector'

export const Injectable = makeConstructorDecorator<IInjectableParameters | void>({ handler: injectableHandler, moment: 'decorate' })

function injectableHandler(ctor: IType<any>, props: IInjectableParameters | void): void {
  const originalCtor = getOriginalCtor(ctor)
  const provideAs = (props as IInjectableParameters)?.provideAs || ctor
  const providedIn = (props as IInjectableParameters)?.providedIn || defaultInjectorConfig.providedIn
  const parentInjector = Injector.getInjector(originalCtor)
  parentInjector.set({ provideAs, providedIn, parentInjector, provide: ctor })
}
