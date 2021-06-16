import { getResolver } from '../core'
import { IType, Provider } from '../models'
import { Injector } from './injector'

export function bootstrap(services: IType<any>[], providers?: Provider<any>[]): void {
  services.forEach(s => {
    const resolver = getResolver(s)
    if (!resolver.hasName('Service')) throw new Error(`${s.prototype.name} is not a service`)
  })
  const rootInjector = Injector.create(providers)
  services.forEach(s => {
    const injector = Injector.getInjector(s)
    if (!injector) throw new Error(`${s.prototype.name} is not a injectable`)
    injector.parent = rootInjector
    injector.get(s)
  })
}
