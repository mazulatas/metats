import { ProvidedStrategy } from './provided-strategy'
import { Token } from './token'

export interface IInjectableParameters {
  provideAs?: Token<any>
  providedIn?: ProvidedStrategy
}
