import { Factory } from './factory'
import { IInjectionToken } from './injection-token'

export type Token<T> =  IInjectionToken<T> | Factory<T>
