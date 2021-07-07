import { getDeepField, getOriginalCtor, hasDeepField, makeConstructorDecorator } from '../core'
import { IInjectableOptions, Provider, SELF_PROVIDER } from '../models'
import { Injector } from './injector'

export const Injectable = makeConstructorDecorator<IInjectableOptions | void>(
  { handler, name: 'Injectable', moment: 'decorate', prohibitDuplicates: true }
)

function handler(ctx: any, props: IInjectableOptions | void) {
  const innerProps: IInjectableOptions = props || {}
  const inRoot = innerProps.provideIn === 'root'
  const selfProvider: Provider<any> = buildProvider(ctx, props)
  Reflect.set(ctx, SELF_PROVIDER, selfProvider)
  const injector = inRoot ? Injector.root : Injector.getOrCreateInjector(ctx)
  Injector.setInjector(ctx, injector)
  const rawProviders: any[] = innerProps.providers || []
  const providers: Provider<any>[] = []
  providers.push(selfProvider)
  for (let i = 0; i < rawProviders.length; i++) {
    const rawProvider = getOriginalCtor(rawProviders[i])
    const provider: Provider<any> = hasDeepField(rawProvider, SELF_PROVIDER) ?
      getDeepField(rawProvider, SELF_PROVIDER) :
      rawProvider
    providers.push(provider)
    const injectorStorage = getInjectorStorage(rawProvider)
    const providerInjector = Injector.getInjector(injectorStorage)
    if (!providerInjector) continue
    Injector.bindParentInjector(rawProviders, injector)
  }
  injector.set(providers)
}

function buildProvider(ctx: any, params: IInjectableOptions | void | null): Provider<any> {
  const innerParams: IInjectableOptions = params || {}
  const isAny = innerParams.provideIn === 'any'
  const provideAs = innerParams.provideAs || ctx
  return { isAny, token: provideAs, useClass: ctx }
}

function getInjectorStorage(provider: Provider<any>): any {
  if ('useClass' in provider) return provider.useClass
  if ('useValue' in provider) return Reflect.get(provider.useValue, 'prototype')
  return provider
}
