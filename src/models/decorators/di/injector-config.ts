import { ProvidedIn } from './provided-in'
import { Token } from './token'

export interface IInjectorConfig<T> {
  provide: Token<T>,
  provideAs?: Token<T>
  providedIn?: ProvidedIn
}
