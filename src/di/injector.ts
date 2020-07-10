import { checkFakeCtor, getOriginalCtor } from '../core/utils'
import { INJECTOR } from '../models/core/sumbols'
import { IType } from '../models/core/type'
import { IInjector } from '../models/di/injector'
import { IInjectorConfig } from '../models/di/injector-config'
import { ProvidedStrategy } from '../models/di/provided-strategy'
import { Token } from '../models/di/token'
import { InjectionToken } from './injection-token'

export const defaultInjectorConfig: IInjectorConfig<InjectionToken<null>> = {
  provide: InjectionToken.null(),
  providedIn: 'any'
}

export class Injector implements IInjector {

  public static get<T>(token: Token<T>, injectOf?: ProvidedStrategy): T {
    return Injector.rootInjector.get(token, injectOf)
  }

  public static set<T>(providers: IInjectorConfig<T> | IInjectorConfig<T>[]): void {
    return Injector.rootInjector.set(providers)
  }

  public static create<T>(parent: IInjector = Injector.rootInjector, providers?: IInjectorConfig<T> | IInjectorConfig<T>[]): IInjector {
    const newInjector = new Injector(parent)
    if (providers) newInjector.set(providers)
    return newInjector
  }

  private static innerInstance: IInjector

  private static get rootInjector(): IInjector {
    if (!Injector.innerInstance) Injector.innerInstance = new Injector()
    return Injector.innerInstance
  }

  private static getName(token?: Token<any>) {
    return (token as any).name?.toString() || token?.toString()
  }

  private injectStorage: WeakMap<Token<any>, ProvideWrapper<any>> = new WeakMap()

  private constructor(private parent?: IInjector) {}

  public set<T>(providers: IInjectorConfig<T> | IInjectorConfig<T>[]): void {
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

  public get<T>(token: Token<T>, injectOf?: ProvidedStrategy): T {
    let innerToken = token
    if (checkFakeCtor(token as any)) innerToken = getOriginalCtor(token as any)
    if (!this.injectStorage.has(innerToken) && !this.parent) throw new Error(`token ${Injector.getName(innerToken)} not found`)
    if (!this.injectStorage.has(innerToken) && this.parent) return this.parent.get(token, injectOf)
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
