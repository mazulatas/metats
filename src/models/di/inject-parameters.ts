import { ProvidedStrategy } from './provided-strategy'
import { Token } from './token'

export interface IInjectParameters {
  token: Token<any>
  injectOf?: ProvidedStrategy,
  optional?: boolean
}
