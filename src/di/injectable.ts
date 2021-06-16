import { getOriginalCtor, makeConstructorDecorator } from '../core'
import { Provider } from '../models'
import { IInjectableOptions } from '../models/di/injectable-options'
import { Injector } from './injector'

export const Injectable = makeConstructorDecorator<IInjectableOptions | void>(
  { handler, name: 'Injectable', moment: 'decorate', prohibitDuplicates: true }
)

function handler(ctx: any, props: IInjectableOptions | void) {
  const innerProps: IInjectableOptions = props || {}
  const isAny = innerProps.provideIn === 'any'
  const inRoot = innerProps.provideIn === 'root'
  const provideAs = innerProps.provideAs || ctx
  const selfProvider: Provider<any> = { isAny, token: provideAs, useClass: ctx }
  const providers: any[] = innerProps.providers?.map(p => getOriginalCtor(p)) || []
  const injector = inRoot ? Injector.root : Injector.getOrCreateInjector(ctx)
  injector.set([ selfProvider, ...providers ])
  Injector.setInjector(ctx, injector)
  for (let i = 0; i < providers.length; i++) {
    const rawProvider = providers[i]
    const provider = 'token' in rawProvider ? rawProvider.token : rawProvider
    const providerInjector = Injector.getOrCreateInjector(provider, [ rawProvider ])
    Injector.setInjector(provider, providerInjector)
    Injector.bindParentInjector(provider, injector)
  }
}
