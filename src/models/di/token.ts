import { IType } from '../core/type'
import { IInjectionToken } from './injection-token'

export type Factory<T> = IType<T> | ((...args: any[]) => T)
export type Token<T> =  IInjectionToken<T> | Factory<T>
