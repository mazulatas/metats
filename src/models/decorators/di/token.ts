import { IType } from '../../core/type'
import { IInjectionToken } from './injection-token'

export type Token<T> =  IType<T> | IInjectionToken<T>
