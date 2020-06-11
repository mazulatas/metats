import { IInjectorConfig } from './injector-config'
import { ProvidedStrategy } from './provided-strategy'
import { Token } from './token'

export interface IInjector {
  get<T>(token: Token<T>, injectOf?: ProvidedStrategy): T
  set<T>(providers: IInjectorConfig<T> | IInjectorConfig<T>[]): void
}
