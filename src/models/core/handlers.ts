import { IType } from './type'

type Target<T> = IType<T> | T

export interface IBaseHandler<T = any> {
  (target: Target<T>,...args: any[]): void
}

export interface IConstructorHandler<P, T = any> extends IBaseHandler<T> {
  (target: Target<T>, props: P): void
}

export interface IMethodHandler<P, T = any> extends IBaseHandler<T> {
  (target: Target<T>, props: P, methodName: string, descriptor: PropertyDescriptor): void
}

export interface IFieldHandler<P, T = any> extends IBaseHandler<T> {
  (target: Target<T>, props: P, fieldName: string): void
}

export interface IParameterHandler<P, T = any> extends IBaseHandler<T> {
  (target: Target<T>, props: P, parameterName: string, index: number): void
}
