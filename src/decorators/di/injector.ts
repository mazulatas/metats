import { checkFakeCtor, getOriginalCtor } from '../../core/utils'
import { IInjectorConfig } from '../../models/decorators/di/injector-config'
import { ProvidedStrategy } from '../../models/decorators/di/provided-strategy'
import { Token } from '../../models/decorators/di/token'
import { InjectionToken } from './injection-token'

export const defaultInjectorConfig: IInjectorConfig<InjectionToken<null>> = {
  provide: InjectionToken.null(),
  providedIn: 'any'
}

export class Injector {

  public static get<T>(token: Token<T>, injectOf?: ProvidedStrategy): T {
    return Injector.instance.get(token, injectOf)
  }

  public static set<T>(providers: IInjectorConfig<T> | IInjectorConfig<T>[]): void {
    return Injector.instance.set(providers)
  }

  private static innerInstance: Injector

  private static get instance(): Injector {
    if (!Injector.innerInstance) Injector.innerInstance = new Injector()
    return Injector.innerInstance
  }

  private static getName(token: Token<any>) {
    return (token as any).name?.toString() || token.toString()
  }

  private injectStorage: WeakMap<Token<any>, ProvideWrapper<any>> = new WeakMap()

  private constructor() {}

  private set<T>(providers: IInjectorConfig<T> | IInjectorConfig<T>[]): void {
    const innerProviders = Array.isArray(providers) ? providers : [providers]
    for (const provider of innerProviders) {
      const fullProvider = {...defaultInjectorConfig, ...provider}
      const { provide } = fullProvider
      if (this.injectStorage.has(provide)) throw new Error(`provider ${Injector.getName(provide)} is created`)
      const wrapper = new ProvideWrapper(fullProvider)
      const provideAs = fullProvider?.provideAs || fullProvider.provide
      this.injectStorage.set(provideAs, wrapper)
    }
  }

  private get<T>(token: Token<T>, injectOf?: ProvidedStrategy): T {
    let innerToken = token
    if (checkFakeCtor(token as any)) innerToken = getOriginalCtor(token as any)
    if (!this.injectStorage.has(innerToken)) throw new Error(`token ${Injector.getName(innerToken)} not found`)
    const cell: ProvideWrapper<T> = this.injectStorage.get(innerToken) as ProvideWrapper<T>
    return cell.getInstance(injectOf)
  }

}

export class ProvideWrapper<T> {
  private instance?: T
  constructor(private providers: IInjectorConfig<T>) {}

  public getInstance(injectOf?: ProvidedStrategy): T {
    if (this.providers.providedIn === 'any' || injectOf === 'any') return this.createNewInstance()
    if (!this.instance) this.instance = this.createNewInstance()
    return this.instance
  }

  private createNewInstance(): T {
    const { provide } = this.providers
    let factory
    if (provide instanceof InjectionToken) factory = provide.provider
    else factory = provide as any
    const instance = new factory()
    if (instance) return instance
    return factory()
  }
}
