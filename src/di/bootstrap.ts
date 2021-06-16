import { getResolver } from '../core'
import { IType, Provider } from '../models'
import { Injector } from './injector'

export function bootstrap(services: IType<any>[], providers?: Provider<any>[]): void {
  services.forEach(s => {
    const resolver = getResolver(s)
    if (!resolver.hasName('Injectable')) throw new Error(`${s.name} is not a injectable`)
  })
  const rootInjector = Injector.root
  if (providers) rootInjector.set(providers)
  Injector.bindParentInjector(services, rootInjector)
  services.forEach(s => {
    const injector = Injector.getInjector(s)
    if (!injector) throw new Error(`${s.name} is not a injectable`)
    injector.get(s)
  })
}
