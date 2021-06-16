import { IArgumentsWrapper } from './arguments-wrapper'
import { IType } from './type'

type Target<T> = IType<T> | T

export interface IBaseHandler<T = any> {
  (target: Target<T>,...args: any[]): void
}

export interface IConstructorHandler<P, T = any> extends IBaseHandler<T> {
  (target: Target<T>, props: P, args: IArgumentsWrapper): void
}

export interface IMethodHandler<P, T = any> extends IBaseHandler<T> {
  (target: Target<T>, props: P, methodName: string, descriptor: PropertyDescriptor, args: IArgumentsWrapper): void
}

export interface IFieldHandler<P, T = any> extends IBaseHandler<T> {
  (target: Target<T>, props: P, fieldName: string, args: IArgumentsWrapper): void
}

export interface IParameterHandler<P, T = any> extends IBaseHandler<T> {
  (target: Target<T>, props: P, parameterName: string, index: number, args: IArgumentsWrapper): void
}
