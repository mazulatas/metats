import { IType } from '../core'
import { IInjectionToken } from './injection-token'

export type Provider<T> = ShortProvider<T> | ValueProvider<T> | FactoryProvider<T> | ClassProvider<T>
export type ShortProvider<T> = IType<T>
export type ValueProvider<T> = BaseProvider<{ useValue: T }, T>
export type FactoryProvider<T> = BaseProvider<{ useFactory: (...args: any[]) => T }, T>
export type ClassProvider<T> = BaseProvider<{ useClass: IType<T> }, T>
export type BaseProvider<O, T> = O & IFToken<T> & IFDeps & IFIsAny

export type Token<T> = IInjectionToken | TypeToken<T>
export type TypeToken<T> = IType<T>

export type ProvideInStrategy = null | 'root' | 'any'
export type ProvideAsStrategy = Token<any>

export interface IFDeps {
  deps?: Provider<any>[]
}

export interface IFToken<T> {
  token: Token<T>
}

export interface IFProvideIn {
  provideIn?: ProvideInStrategy
}

export interface IFProvideAs {
  provideAs?: ProvideAsStrategy
}

export interface IFIsAny {
  isAny?: boolean
}

export interface IFProviders {
  providers?: Provider<any>[]
}
