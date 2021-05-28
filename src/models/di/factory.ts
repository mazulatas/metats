import { IType } from '../core'

export type Factory<T> = IType<T> | ((...args: any[]) => T)
