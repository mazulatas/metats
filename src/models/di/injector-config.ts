import { IInjector } from './injector'
import { ProvidedStrategy } from './provided-strategy'
import { Token } from './token'

export interface IInjectorConfig<T> {
  provide: Token<T>,
  provideAs?: Token<T>
  providedIn?: ProvidedStrategy
}
